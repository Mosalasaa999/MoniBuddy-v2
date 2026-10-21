"""
Stokvel ledger blueprint. LEDGER ONLY: no money is held, moved or initiated here.
Privacy design:
  * Every membership is a separate pseudonym (member_id + its own session token), so the server
    CANNOT link one person's memberships across groups. A "total financial footprint" endpoint
    is impossible by construction.
  * Aliases only. Phone numbers / SA ID numbers are rejected on input.
  * Tokens and invite codes are stored only as HMAC-SHA256 hashes.
  * Consent-based visibility is enforced on every read (see _view_entry).
  * Dispute reasons are enum codes, never free text (no PII channel).
"""
import hashlib, hmac, os, re, secrets, threading, uuid
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Blueprint, g, jsonify, request
from common import ApiError, json_body, utcnow

bp = Blueprint("stokvel", __name__, url_prefix="/api/v1")

PENDING, VERIFIED, DISPUTED = "PENDING", "VERIFIED", "DISPUTED"
DISPUTE_REASONS = {"NOT_RECEIVED", "WRONG_AMOUNT", "WRONG_PERIOD", "DUPLICATE", "OTHER"}
SESSION_TTL = timedelta(days=30)
MAX_SYNC_OPS = 50
MIN_GROUP_FOR_AGGREGATES = 3  # k-threshold so aggregates cannot single out one member

_PEPPER = (os.environ.get("MONIBUDDY_PEPPER") or secrets.token_hex(32)).encode()
_PII = re.compile(r"(?<!\d)(?:\d{13}|0\d{9}|\+?27\d{9})(?!\d)|@")  # SA ID, SA cell, email
_LABEL = re.compile(r"^[\w .'\-]{1,24}$")
_PERIOD = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")
_CID = re.compile(r"^[A-Za-z0-9\-]{8,64}$")


def _h(value: str) -> str:
    return hmac.new(_PEPPER, value.encode(), hashlib.sha256).hexdigest()


class Store:
    """In-memory stand-in for the real DB (swap for Postgres/Redis; same shape)."""
    def __init__(self):
        self.lock = threading.RLock()
        self.groups = {}    # group_id -> group
        self.sessions = {}  # token_hash -> {group_id, member_id, last_seen}

STORE = Store()


# ---------- validation -------------------------------------------------------
def _label(value, field):
    if not isinstance(value, str) or not _LABEL.match(value.strip()):
        raise ApiError(400, "INVALID_FIELD", f"{field} must be 1-24 letters/digits/spaces.")
    if _PII.search(value):
        raise ApiError(400, "PII_REJECTED", f"{field} looks like a phone/ID/email. Use a nickname.")
    return value.strip()


def _int(value, field, lo, hi):
    if isinstance(value, bool) or not isinstance(value, int) or not lo <= value <= hi:
        raise ApiError(400, "INVALID_FIELD", f"{field} must be an integer between {lo} and {hi}.")
    return value


def _consent(raw):
    raw = raw if isinstance(raw, dict) else {}
    # Default is PRIVATE. Visibility is strictly opt-in.
    return {"share_status": raw.get("share_status") is True, "share_amounts": raw.get("share_amounts") is True}


def _client_ts(value):
    if value is None: return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).astimezone(timezone.utc).isoformat(timespec="seconds")
    except ValueError:
        raise ApiError(400, "INVALID_FIELD", "client_ts must be ISO-8601.")


# ---------- auth -------------------------------------------------------------
def _new_session(group_id, member_id):
    token = secrets.token_urlsafe(32)
    STORE.sessions[_h(token)] = {"group_id": group_id, "member_id": member_id, "last_seen": datetime.now(timezone.utc)}
    return token


def auth(fn):
    @wraps(fn)
    def wrapper(*a, **kw):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            raise ApiError(401, "UNAUTHENTICATED", "Bearer token required.")
        with STORE.lock:
            key = _h(header[7:].strip())
            s = STORE.sessions.get(key)
            now = datetime.now(timezone.utc)
            if not s or now - s["last_seen"] > SESSION_TTL:
                STORE.sessions.pop(key, None)
                raise ApiError(401, "UNAUTHENTICATED", "Invalid or expired session.")
            s["last_seen"] = now
        gid = kw.get("gid")
        if gid is not None and gid != s["group_id"]:
            raise ApiError(403, "FORBIDDEN", "Session is not valid for this group.")
        g.group_id, g.member_id = s["group_id"], s["member_id"]
        return fn(*a, **kw)
    return wrapper


def _group(gid):
    grp = STORE.groups.get(gid)
    if not grp: raise ApiError(404, "NOT_FOUND", "Group not found.")
    return grp


# ---------- views (consent enforcement lives here) ---------------------------
def _view_entry(grp, e, viewer):
    owner = grp["members"][e["member_id"]]
    is_owner, is_treasurer = e["member_id"] == viewer, grp["treasurer_id"] == viewer
    base = {"entry_id": e["entry_id"], "period": e["period"], "state": e["state"],
            "version": e["version"], "updated_at": e["updated_at"], "seq": e["updated_seq"]}
    if is_owner or is_treasurer:  # treasurer review is a disclosed purpose of the ledger
        base.update(member_id=e["member_id"], amount_cents=e["amount_cents"], created_at=e["created_at"],
                    client_ts=e["client_ts"], dispute=e["dispute"])
        if is_owner: base["client_entry_id"] = e["client_entry_id"]
        return base
    c = owner["consent"]
    if not c["share_status"]:
        return None  # existence itself is hidden
    base["member_id"] = e["member_id"]
    if c["share_amounts"]: base["amount_cents"] = e["amount_cents"]
    return base


def _ledger(grp, viewer, since_seq=0):
    me = grp["members"][viewer]
    entries = [v for e in grp["entries"].values() if e["updated_seq"] > since_seq
               if (v := _view_entry(grp, e, viewer))]
    entries.sort(key=lambda x: x["seq"])
    members = []
    for mid, m in grp["members"].items():
        if not m["active"]: continue
        show = mid == viewer or m["consent"]["share_status"] or grp["treasurer_id"] == viewer
        members.append({"member_id": mid, "role": m["role"], **({"alias": m["alias"]} if show else {})})
    out = {"group_id": grp["group_id"], "name": grp["name"], "contribution_cents": grp["contribution_cents"],
           "cycle": grp["cycle"], "you": {"member_id": viewer, "role": me["role"], "consent": me["consent"]},
           "members": members, "entries": entries, "server_seq": grp["seq"]}
    if sum(m["active"] for m in grp["members"].values()) >= MIN_GROUP_FOR_AGGREGATES:
        es = grp["entries"].values()
        out["summary"] = {"verified_total_cents": sum(e["amount_cents"] for e in es if e["state"] == VERIFIED),
                          **{f"{s.lower()}_count": sum(e["state"] == s for e in es) for s in (PENDING, VERIFIED, DISPUTED)}}
    return out


# ---------- domain operations (shared by REST routes and /sync) --------------
def _bump(grp, e, now):
    grp["seq"] += 1
    e["version"] += 1
    e["updated_seq"], e["updated_at"] = grp["seq"], now


def op_log(grp, mid, d):
    cid = d.get("client_entry_id")
    if not isinstance(cid, str) or not _CID.match(cid):
        raise ApiError(400, "INVALID_FIELD", "client_entry_id (8-64 chars, client-generated UUID) required.")
    amount = _int(d.get("amount_cents"), "amount_cents", 1, 5_000_000)
    period = d.get("period")
    if not isinstance(period, str) or not _PERIOD.match(period):
        raise ApiError(400, "INVALID_FIELD", "period must be YYYY-MM.")
    with STORE.lock:
        existing = grp["idem"].get((mid, cid))      # idempotent replay from a flaky/offline client
        if existing: return grp["entries"][existing], False
        now, eid = utcnow(), uuid.uuid4().hex
        e = {"entry_id": eid, "client_entry_id": cid, "member_id": mid, "period": period, "amount_cents": amount,
             "state": PENDING, "client_ts": _client_ts(d.get("client_ts")), "created_at": now, "updated_at": now,
             "version": 0, "updated_seq": 0, "dispute": None}
        grp["entries"][eid] = e
        grp["idem"][(mid, cid)] = eid
        _bump(grp, e, now)
        return e, True


def _entry(grp, eid):
    e = grp["entries"].get(eid)
    if not e: raise ApiError(404, "NOT_FOUND", "Entry not found.")
    return e


def _check_version(e, d):
    ev = d.get("expected_version")
    if ev is not None and ev != e["version"]:
        raise ApiError(409, "VERSION_CONFLICT", f"Entry is at version {e['version']}; refetch and retry.")


def op_verify(grp, mid, eid, d):
    with STORE.lock:
        e = _entry(grp, eid)
        if e["member_id"] == mid:
            raise ApiError(403, "SELF_VERIFY_FORBIDDEN", "You cannot verify your own entry.")
        owner_is_treasurer = e["member_id"] == grp["treasurer_id"]
        if grp["treasurer_id"] != mid and not owner_is_treasurer:
            raise ApiError(403, "FORBIDDEN", "Only the treasurer can verify (peers verify the treasurer's own entries).")
        if e["state"] == VERIFIED: return e, False   # idempotent
        _check_version(e, d)
        e["state"], e["dispute"] = VERIFIED, None    # also resolves a DISPUTED entry
        _bump(grp, e, utcnow())
        return e, True


def op_dispute(grp, mid, eid, d):
    reason = d.get("reason_code")
    if reason not in DISPUTE_REASONS:
        raise ApiError(400, "INVALID_FIELD", f"reason_code must be one of {sorted(DISPUTE_REASONS)}.")
    with STORE.lock:
        e = _entry(grp, eid)
        if mid not in (e["member_id"], grp["treasurer_id"]):
            raise ApiError(403, "FORBIDDEN", "Only the entry owner or treasurer can dispute.")
        if e["state"] == DISPUTED: return e, False   # idempotent
        _check_version(e, d)
        now = utcnow()
        e["state"] = DISPUTED
        e["dispute"] = {"reason_code": reason, "raised_by": "owner" if mid == e["member_id"] else "treasurer", "raised_at": now}
        _bump(grp, e, now)
        return e, True


# ---------- REST routes ------------------------------------------------------
@bp.post("/groups")
def create_group():
    d = json_body()
    name, alias = _label(d.get("name"), "name"), _label(d.get("alias"), "alias")
    amount = _int(d.get("contribution_cents"), "contribution_cents", 1, 5_000_000)
    cycle = d.get("cycle", "monthly")
    if cycle not in ("weekly", "monthly"): raise ApiError(400, "INVALID_FIELD", "cycle must be weekly|monthly.")
    gid, mid, invite = uuid.uuid4().hex, uuid.uuid4().hex, secrets.token_urlsafe(6)
    with STORE.lock:
        STORE.groups[gid] = {"group_id": gid, "name": name, "contribution_cents": amount, "cycle": cycle,
                             "treasurer_id": mid, "invite_hash": _h(invite), "created_at": utcnow(), "seq": 0,
                             "members": {mid: {"alias": alias, "role": "treasurer", "active": True,
                                               "consent": _consent(d.get("consent")), "joined_at": utcnow()}},
                             "entries": {}, "idem": {}}
        token = _new_session(gid, mid)
    return jsonify(group_id=gid, member_id=mid, session_token=token, invite_code=invite), 201


@bp.post("/groups/<gid>/join")
def join_group(gid):
    d = json_body()
    alias = _label(d.get("alias"), "alias")
    code = d.get("invite_code")
    grp = _group(gid)
    if not isinstance(code, str) or not hmac.compare_digest(_h(code), grp["invite_hash"]):
        raise ApiError(403, "BAD_INVITE", "Invalid invite code.")
    mid = uuid.uuid4().hex
    with STORE.lock:
        grp["members"][mid] = {"alias": alias, "role": "member", "active": True,
                               "consent": _consent(d.get("consent")), "joined_at": utcnow()}
        token = _new_session(gid, mid)
    return jsonify(group_id=gid, member_id=mid, session_token=token), 201


@bp.get("/groups/<gid>/ledger")
@auth
def get_ledger(gid):
    since = request.args.get("since_seq", "0")
    since = int(since) if since.isdigit() else 0
    return jsonify(_ledger(_group(gid), g.member_id, since))


@bp.patch("/groups/<gid>/consent")
@auth
def update_consent(gid):
    grp = _group(gid)
    with STORE.lock:
        grp["members"][g.member_id]["consent"] = _consent(json_body())
    return jsonify(consent=grp["members"][g.member_id]["consent"])


@bp.post("/groups/<gid>/contributions")
@auth
def log_contribution(gid):
    e, created = op_log(_group(gid), g.member_id, json_body())
    return jsonify(_view_entry(_group(gid), e, g.member_id)), (201 if created else 200)


@bp.post("/groups/<gid>/contributions/<eid>/verify")
@auth
def verify_contribution(gid, eid):
    grp = _group(gid)
    e, _ = op_verify(grp, g.member_id, eid, request.get_json(silent=True) or {})
    return jsonify(_view_entry(grp, e, g.member_id))


@bp.post("/groups/<gid>/contributions/<eid>/dispute")
@auth
def dispute_contribution(gid, eid):
    grp = _group(gid)
    e, _ = op_dispute(grp, g.member_id, eid, json_body())
    return jsonify(_view_entry(grp, e, g.member_id))


@bp.post("/groups/<gid>/sync")
@auth
def sync(gid):
    """Offline reconciliation: apply a queued batch idempotently, then return everything newer than since_seq.
    Convergence rules: (1) server arrival order is the single source of truth (monotonic group seq);
    (2) every op is idempotent (client_entry_id / state already reached); (3) client clocks are advisory only;
    (4) optional expected_version surfaces conflicts instead of silently overwriting."""
    d, grp = json_body(), _group(gid)
    ops = d.get("ops", [])
    if not isinstance(ops, list) or len(ops) > MAX_SYNC_OPS:
        raise ApiError(400, "INVALID_FIELD", f"ops must be a list of at most {MAX_SYNC_OPS}.")
    results = []
    for op in ops:
        op = op if isinstance(op, dict) else {}
        r = {"op_id": op.get("op_id")}
        try:
            t = op.get("type")
            if t == "log_contribution": e, ch = op_log(grp, g.member_id, op)
            elif t == "verify": e, ch = op_verify(grp, g.member_id, op.get("entry_id"), op)
            elif t == "dispute": e, ch = op_dispute(grp, g.member_id, op.get("entry_id"), op)
            else: raise ApiError(400, "UNKNOWN_OP", "type must be log_contribution|verify|dispute.")
            r.update(status="applied" if ch else "duplicate", entry=_view_entry(grp, e, g.member_id))
        except ApiError as ex:
            r.update(status="conflict" if ex.status == 409 else "rejected", error={"code": ex.code, "message": ex.message})
        results.append(r)
    since = d.get("since_seq", 0)
    since = since if isinstance(since, int) and since >= 0 else 0
    return jsonify(results=results, delta=_ledger(grp, g.member_id, since))


@bp.delete("/groups/<gid>/membership")
@auth
def leave_group(gid):
    """POPIA erasure: drop alias, consent and every session for this member. Entries stay (group ledger integrity)
    but are anonymised to an opaque ID."""
    grp = _group(gid)
    with STORE.lock:
        if g.member_id == grp["treasurer_id"]:
            if any(m["active"] for k, m in grp["members"].items() if k != g.member_id):
                raise ApiError(409, "TREASURER_CANNOT_LEAVE", "Group still has active members.")
            STORE.groups.pop(gid, None)           # last person out: delete the whole group
        else:
            m = grp["members"][g.member_id]
            m.update(alias="former member", active=False, consent={"share_status": False, "share_amounts": False})
        for k in [k for k, s in STORE.sessions.items() if s["member_id"] == g.member_id]:
            del STORE.sessions[k]
    return "", 204


def purge_expired():
    """Retention job (cron / background thread): expire idle sessions, drop stale idempotency keys."""
    now = datetime.now(timezone.utc)
    with STORE.lock:
        for k in [k for k, s in STORE.sessions.items() if now - s["last_seen"] > SESSION_TTL]:
            del STORE.sessions[k]
        cutoff = (now - timedelta(days=30)).isoformat(timespec="seconds")
        for grp in STORE.groups.values():
            grp["idem"] = {k: v for k, v in grp["idem"].items() if grp["entries"][v]["created_at"] >= cutoff}
