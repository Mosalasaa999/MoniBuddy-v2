"""
Non-custodial stokvel ledger calculator.

Pure functions, no I/O, no storage, no money movement. The app only does the arithmetic
(who gets paid when, what the pot should be, who is short) from numbers the group reports.
All amounts are integer cents so there is never floating-point drift.

Nothing here holds, receives, transfers or initiates funds, so it stays a record-keeping /
calculation aid rather than a payment or deposit-taking service.
"""
import calendar
import re
from datetime import date, datetime, timedelta

MAX_MEMBERS = 50
MAX_PAYMENTS = 5_000
MAX_CONTRIBUTION_CENTS = 5_000_000  # R50 000 per member per turn
CYCLES = ("weekly", "monthly")

# SA ID (13 digits), SA cell numbers, emails: refuse to store/echo them as "names".
_PII = re.compile(r"(?<!\d)(?:\d{13}|0\d{9}|\+?27\d{9})(?!\d)|@")
_NAME = re.compile(r"^[\w .'\-]{1,24}$")


class LedgerError(ValueError):
    """Bad input. `code` is machine readable, message is safe to show the user."""
    def __init__(self, code, message):
        super().__init__(message)
        self.code, self.message = code, message


# ---------- validation -------------------------------------------------------
def _name(value):
    if not isinstance(value, str) or not _NAME.match(value.strip()):
        raise LedgerError("INVALID_MEMBER", "Member names must be 1-24 letters, digits or spaces.")
    if _PII.search(value) or _PII.search(re.sub(r"[ .\-]", "", value)):
        raise LedgerError("PII_REJECTED", "Use a nickname, not a phone number, ID number or email.")
    return value.strip()


def _cents(value, field, lo, hi):
    if isinstance(value, bool) or not isinstance(value, int) or not lo <= value <= hi:
        raise LedgerError("INVALID_FIELD", f"{field} must be a whole number of cents between {lo} and {hi}.")
    return value


def _date(value, field):
    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    except ValueError:
        raise LedgerError("INVALID_FIELD", f"{field} must be a date in YYYY-MM-DD format.")


def _add_months(d: date, months: int) -> date:
    y, m = divmod(d.month - 1 + months, 12)
    y, m = d.year + y, m + 1
    return date(y, m, min(d.day, calendar.monthrange(y, m)[1]))  # 31 Jan + 1 month -> 28/29 Feb


def due_date(start: date, cycle: str, turn_index: int) -> date:
    """Due date of turn `turn_index` (0-based)."""
    return start + timedelta(days=7 * turn_index) if cycle == "weekly" else _add_months(start, turn_index)


# ---------- core calculation -------------------------------------------------
def build_plan(data: dict, today: date = None) -> dict:
    """
    Input (all amounts in cents):
      members:            ["Thandi", "Sipho", ...]        2-50 unique nicknames, in default payout order
      payout_order:       optional permutation of members (e.g. a draw the group already did)
      contribution_cents: what EACH member owes EACH turn
      cycle:              "weekly" | "monthly"
      start_date:         YYYY-MM-DD, due date of turn 1
      payments:           [{"member": "Sipho", "turn": 1, "amount_cents": 50000}, ...]  as reported by the group
      today:              optional YYYY-MM-DD override (testing / replaying a past date)

    Output: the full rotation with, per turn, the recipient, the expected pot, what was reported
    received, the shortfall and exactly who is short; plus per-member arrears.
    """
    if not isinstance(data, dict):
        raise LedgerError("BAD_JSON", "Body must be a JSON object.")

    members = data.get("members")
    if not isinstance(members, list) or not 2 <= len(members) <= MAX_MEMBERS:
        raise LedgerError("INVALID_FIELD", f"members must be a list of 2-{MAX_MEMBERS} nicknames.")
    members = [_name(m) for m in members]
    if len({m.lower() for m in members}) != len(members):
        raise LedgerError("DUPLICATE_MEMBER", "Each member needs a unique nickname.")

    order = data.get("payout_order")
    if order is None:
        order = members
    else:
        if not isinstance(order, list):
            raise LedgerError("INVALID_FIELD", "payout_order must be a list of member nicknames.")
        order = [_name(m) for m in order]
        if sorted(m.lower() for m in order) != sorted(m.lower() for m in members):
            raise LedgerError("INVALID_ORDER", "payout_order must contain every member exactly once.")
        canon = {m.lower(): m for m in members}
        order = [canon[m.lower()] for m in order]

    contribution = _cents(data.get("contribution_cents"), "contribution_cents", 1, MAX_CONTRIBUTION_CENTS)
    cycle = data.get("cycle", "monthly")
    if cycle not in CYCLES:
        raise LedgerError("INVALID_FIELD", "cycle must be weekly or monthly.")
    start = _date(data.get("start_date"), "start_date")
    if today is None:
        today = _date(data["today"], "today") if data.get("today") else date.today()

    n = len(members)
    canon = {m.lower(): m for m in members}
    paid = {}  # (member, turn) -> cents reported
    payments = data.get("payments", [])
    if not isinstance(payments, list) or len(payments) > MAX_PAYMENTS:
        raise LedgerError("INVALID_FIELD", f"payments must be a list of at most {MAX_PAYMENTS}.")
    for p in payments:
        if not isinstance(p, dict):
            raise LedgerError("INVALID_PAYMENT", "Each payment must be an object.")
        who = canon.get(str(p.get("member", "")).strip().lower())
        turn = p.get("turn")
        if who is None:
            raise LedgerError("INVALID_PAYMENT", "A payment names someone who is not a member.")
        if isinstance(turn, bool) or not isinstance(turn, int) or not 1 <= turn <= n:
            raise LedgerError("INVALID_PAYMENT", f"turn must be a whole number from 1 to {n}.")
        amount = _cents(p.get("amount_cents"), "amount_cents", 1, MAX_CONTRIBUTION_CENTS * 2)
        paid[(who, turn)] = paid.get((who, turn), 0) + amount

    expected_pot = contribution * n
    turns, arrears = [], {m: 0 for m in members}
    totals = {m: {"paid_cents": 0, "owed_to_date_cents": 0} for m in members}

    for i, recipient in enumerate(order):
        turn_no, due = i + 1, due_date(start, cycle, i)
        closed = due <= today
        received, short_members = 0, []
        for m in members:
            got = paid.get((m, turn_no), 0)
            # Overpaying one turn does not hide a shortfall elsewhere, and does not inflate the pot.
            received += min(got, contribution)
            totals[m]["paid_cents"] += got
            if closed:
                totals[m]["owed_to_date_cents"] += contribution
            missing = contribution - min(got, contribution)
            if missing:
                short_members.append({"member": m, "missing_cents": missing})
                if closed:
                    arrears[m] += missing
        shortfall = expected_pot - received
        if not closed:
            status = "UPCOMING"
        else:
            status = "COMPLETE" if shortfall == 0 else "SHORTFALL"
        turns.append({
            "turn": turn_no,
            "due_date": due.isoformat(),
            "recipient": recipient,
            "expected_pot_cents": expected_pot,
            "received_cents": received,
            "shortfall_cents": shortfall if closed else None,   # a future turn is not "short" yet
            "status": status,
            "short_members": short_members if closed else [],
            # What the recipient should actually receive from the group today if the pot is paid out
            # as-is. The app never moves this money; it is a number for the group to act on.
            "payable_to_recipient_cents": received,
        })

    closed_turns = [t for t in turns if t["status"] != "UPCOMING"]
    return {
        "cycle": cycle,
        "contribution_cents": contribution,
        "member_count": n,
        "expected_pot_cents": expected_pot,
        "full_cycle_total_cents": expected_pot * n,
        "as_of": today.isoformat(),
        "turns": turns,
        "next_turn": next((t for t in turns if t["status"] == "UPCOMING"), None),
        "members": [{"member": m, **totals[m], "arrears_cents": arrears[m]} for m in members],
        "summary": {
            "turns_closed": len(closed_turns),
            "turns_with_shortfall": sum(t["status"] == "SHORTFALL" for t in turns),
            "total_shortfall_cents": sum(t["shortfall_cents"] or 0 for t in closed_turns),
            "members_in_arrears": [m for m in members if arrears[m] > 0],
        },
        "disclaimer": "Record-keeping only. This app does not hold, move or pay out any money.",
    }

