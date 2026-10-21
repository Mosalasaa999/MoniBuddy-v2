from app import create_app
import uuid
from scam_checker import analyze_text

c = create_app().test_client()
def H(t): return {"Authorization": f"Bearer {t}"}

# --- scam checker ---
cases = {
 "Hi this is FNB fraud department. Your account will be blocked. Send us your OTP immediately": "HIGH_RISK",
 "Congratulations you have won R50000! Pay R500 admin fee via eWallet to release your prize": "HIGH_RISK",
 "Your SASSA R350 grant is approved, click https://sassa-srd-claim.xyz/now": "HIGH_RISK",
 "Sorry I sent R2000 to your number by mistake, please send it back": "SUSPICIOUS",
 "Download AnyDesk so I can help with your banking": "SUSPICIOUS",
 "FNB: Never share your PIN or OTP with anyone. FNB will never ask for it.": "NO_KNOWN_PATTERNS",
 "Hey are we still meeting for stokvel on Saturday? Bring R200": "NO_KNOWN_PATTERNS",
 "Send me the c0de you just received by sms": "SUSPICIOUS",
 "Pay r300 registration fee first, then your job vacancy starts": "SUSPICIOUS",
}
for t, want in cases.items():
    r = analyze_text(t)
    ok = r["verdict"] == want or (want == "SUSPICIOUS" and r["verdict"] == "HIGH_RISK")
    print("OK " if ok else "BAD", r["score"], r["verdict"], r["rules"], "|", t[:50])
    assert ok

# --- ledger ---
r = c.post("/api/v1/groups", json={"name": "Alex Savers", "alias": "Thandi", "contribution_cents": 50000}); assert r.status_code == 201, r.json
G = r.json; gid = G["group_id"]
r = c.post("/api/v1/groups", json={"name": "x", "alias": "0821234567", "contribution_cents": 100}); assert r.json["error"]["code"] == "PII_REJECTED"
J = []
for n in ("Sipho", "Lerato", "Naledi"):
    r = c.post(f"/api/v1/groups/{gid}/join", json={"alias": n, "invite_code": G["invite_code"]}); assert r.status_code == 201; J.append(r.json)
assert c.post(f"/api/v1/groups/{gid}/join", json={"alias": "Bad", "invite_code": "nope"}).status_code == 403

cid = str(uuid.uuid4())
body = {"client_entry_id": cid, "amount_cents": 50000, "period": "2026-10", "client_ts": "2026-10-20T08:00:00Z"}
r1 = c.post(f"/api/v1/groups/{gid}/contributions", json=body, headers=H(J[0]["session_token"])); assert r1.status_code == 201
r2 = c.post(f"/api/v1/groups/{gid}/contributions", json=body, headers=H(J[0]["session_token"])); assert r2.status_code == 200 and r2.json["entry_id"] == r1.json["entry_id"]
eid = r1.json["entry_id"]

# privacy default: Lerato (no consent from Sipho) sees nothing of Sipho's entry
assert c.get(f"/api/v1/groups/{gid}/ledger", headers=H(J[1]["session_token"])).json["entries"] == []
# treasurer sees it, owner cannot self-verify, non-treasurer member cannot verify
L = c.get(f"/api/v1/groups/{gid}/ledger", headers=H(G["session_token"])).json; assert len(L["entries"]) == 1
assert c.post(f"/api/v1/groups/{gid}/contributions/{eid}/verify", headers=H(J[0]["session_token"])).status_code == 403
assert c.post(f"/api/v1/groups/{gid}/contributions/{eid}/verify", headers=H(J[1]["session_token"])).status_code == 403
# consent opt-in: status only
c.patch(f"/api/v1/groups/{gid}/consent", json={"share_status": True}, headers=H(J[0]["session_token"]))
e = c.get(f"/api/v1/groups/{gid}/ledger", headers=H(J[1]["session_token"])).json["entries"][0]
assert "amount_cents" not in e and e["state"] == "PENDING"
# verify -> dispute -> resolve
assert c.post(f"/api/v1/groups/{gid}/contributions/{eid}/verify", json={}, headers=H(G["session_token"])).json["state"] == "VERIFIED"
assert c.post(f"/api/v1/groups/{gid}/contributions/{eid}/dispute", json={"reason_code": "free text!"}, headers=H(J[0]["session_token"])).status_code == 400
d = c.post(f"/api/v1/groups/{gid}/contributions/{eid}/dispute", json={"reason_code": "WRONG_AMOUNT"}, headers=H(J[0]["session_token"])).json; assert d["state"] == "DISPUTED"
# sync: offline batch with duplicate + stale version + delta
s = c.post(f"/api/v1/groups/{gid}/sync", headers=H(J[0]["session_token"]), json={"since_seq": 0, "ops": [
    {"op_id": "a", "type": "log_contribution", **body},
    {"op_id": "b", "type": "log_contribution", "client_entry_id": "offline-0002-xyz", "amount_cents": 50000, "period": "2026-11"},
    {"op_id": "c", "type": "dispute", "entry_id": eid, "reason_code": "OTHER", "expected_version": 0}]}).json
print([x["status"] for x in s["results"]], "server_seq", s["delta"]["server_seq"])
assert [x["status"] for x in s["results"]] == ["duplicate", "applied", "duplicate"]
# erasure
assert c.delete(f"/api/v1/groups/{gid}/membership", headers=H(J[2]["session_token"])).status_code == 204
assert c.get(f"/api/v1/groups/{gid}/ledger", headers=H(J[2]["session_token"])).status_code == 401
r = c.post("/api/v1/scam-check", json={"text": "FNB security: send your pin now"}); assert r.status_code == 200 and "text" not in r.json
print("ALL PASSED")
