"""
Deterministic, rule-based scam heuristic engine for South African scam footprints.
No network calls, no ML, no logging of input. Returns rule IDs and categories only
(never echoes the user's text back), so nothing sensitive can leak via responses/logs.
"""
import re
import unicodedata

MAX_CHARS = 2000  # hard cap -> bounded regex work (also guards against ReDoS)

# --- normalisation ---------------------------------------------------------
_ZERO_WIDTH = dict.fromkeys(map(ord, "\u200b\u200c\u200d\u2060\ufeff\u00ad"), None)
_HOMOGLYPHS = str.maketrans("аеорсхуіј", "aeopcxyij")  # common Cyrillic look-alikes
_DELEET = str.maketrans({"0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s"})
_WS = re.compile(r"\s+")


def _views(text: str):
    t = unicodedata.normalize("NFKC", text[:MAX_CHARS]).translate(_ZERO_WIDTH)
    t = _WS.sub(" ", t.lower().translate(_HOMOGLYPHS)).strip()
    return t, t.translate(_DELEET)  # (plain: numbers intact, deleet: catches p1n / 0tp / ewall3t)


# --- awareness clauses ("never share your PIN") are stripped, not scored ----
_AWARE = re.compile(
    r"\b(?:never|do not|don'?t|dont|should not|must not|will never|won'?t ever|please do not)\s+(?:ever\s+)?"
    r"(?:share|give|disclose|reveal|send|tell)\s+(?:your|ur|the)\s+"
    r"(?:pin|otp|password|cvv|one[- ]?time (?:pin|password|code)|verification code|card details)"
    r"(?:\s+(?:to|with)\s+(?:anyone|anybody|any one|no one|a stranger|bank staff))?"
)

_BANKS = r"(?:fnb|first national bank|absa|capitec|nedbank|standard bank|investec|tymebank|discovery bank|african bank|sars|sassa|home affairs)"
_SECRET = (r"(?:pin|otp|one[- ]?time[- ]?(?:pin|password|code)|password|cvv|card number|id number|"
           r"verification code|secret code|banking app code|approve ?it code|login details|card details)")

# (rule_id, category, weight 0-100, view, compiled pattern)  -- bounded quantifiers only
_R = []
def _rule(rid, cat, w, view, pat):
    _R.append((rid, cat, w, view, re.compile(pat, re.S)))

_rule("CRED_ASK_VERB", "credential_request", 45, "deleet",
      rf"\b(?:send|share|give|provide|reply(?: with)?|confirm|enter|verify|update|type|read out|forward|tell me)\b.{{0,30}}\b(?:your|ur|the|ya)?\s?{_SECRET}")
_rule("CRED_ASK_QUESTION", "credential_request", 45, "deleet",
      rf"\b(?:what(?:'s| is)|whats)\s+(?:your|ur)\s+{_SECRET}|\b(?:your|ur)\s+{_SECRET}\s+(?:is )?(?:needed|required|to (?:verify|confirm|reverse|cancel|unlock))")
_rule("OTP_RELAY", "credential_request", 55, "deleet",
      r"\b(?:send|forward|give|read|share|tell)\b.{0,25}\b(?:me|us)?\b.{0,15}\b(?:code|otp|pin|sms|message)\b.{0,30}\b(?:you (?:just |will )?(?:got|get|received|receive)|that was sent|sent to you)")
_rule("ADV_FEE", "advance_fee", 35, "deleet",
      r"\b(?:pay|send|deposit|transfer|load|buy)\b.{0,35}\b(?:r ?\d[\d ,.]*|fee|deposit)\b.{0,45}\b(?:release|unlock|claim|clear(?:ance)?|process(?:ing)?|activate|collect|insurance|admin|registration)")
_rule("EWALLET_DEMAND", "advance_fee", 40, "deleet",
      r"\b(?:e-?wallet|cash ?send|1 ?voucher|ott voucher|blu ?voucher|airtime|bitcoin|gift ?card)\b.{0,40}\b(?:fee|deposit|release|unlock|clearance|admin|to (?:claim|get|receive|release))|"
      r"\b(?:fee|deposit|admin|clearance|release)\b.{0,40}\b(?:via|by|through|using|with|in)\b.{0,10}\b(?:e-?wallet|cash ?send|1 ?voucher|ott voucher|airtime|bitcoin|gift ?card)")
_rule("URGENCY", "urgency", 15, "deleet",
      r"\b(?:urgent(?:ly)?|immediately|right now|act now|asap|last warning|final notice|within \d{1,2} ?(?:hours?|hrs?|minutes?|mins?)|expires? (?:today|soon|tonight)|"
      r"(?:account|card|sim|profile)\b.{0,25}\b(?:will be |has been |is )?(?:blocked|suspended|closed|frozen|deactivated|cancelled|locked))")
_rule("BANK_IMPERSONATION", "impersonation", 30, "deleet",
      rf"\b(?:this is|i am|i'?m|we are|calling from|message from|sms from|from the|on behalf of|you are speaking (?:to|with))\b.{{0,40}}\b{_BANKS}\b.{{0,40}}\b(?:fraud|security|verification|risk|official|department|team|agent|consultant|officer|manager|investigat\w*)|"
      rf"\b{_BANKS}\b.{{0,25}}\b(?:fraud|security|risk|verification)\b.{{0,15}}\b(?:department|team|unit|officer|agent|alert)")
_rule("FAKE_ALERT", "impersonation", 25, "deleet",
      rf"\b(?:suspicious|unauthori[sz]ed|fraudulent|unusual)\b.{{0,30}}\b(?:transaction|activity|login|transfer|purchase|debit)\b|\b(?:your )?{_BANKS}\b.{{0,20}}\b(?:account|card|profile)\b.{{0,25}}\b(?:suspended|blocked|locked|on hold|compromised)")
_rule("LINK_SHORTENER", "suspicious_link", 20, "plain",
      r"\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|is\.gd|rb\.gy|shorturl\.at|ow\.ly|t\.ly)/\S+")
_rule("LINK_BAD_TLD", "suspicious_link", 25, "plain",
      r"https?://[^\s/]+\.(?:xyz|top|click|icu|tk|ml|cf|gq|buzz|cyou|monster|sbs|lol|work|support)\b")
_rule("LINK_LOOKALIKE", "suspicious_link", 35, "plain",
      rf"https?://[^\s/]*(?:{_BANKS.replace('first national bank','firstnational').replace(' ','')}[^\s/.]*-|-[^\s/.]*{_BANKS.replace('first national bank','firstnational').replace(' ','')})[^\s/]*")
_rule("LINK_ANY_WITH_ACTION", "suspicious_link", 10, "plain",
      r"(?:click|tap|open|visit|follow|log ?in at|update at)\b.{0,25}(?:https?://|www\.)\S+")
_rule("PRIZE", "prize_scam", 35, "deleet",
      r"\b(?:you(?:'ve| have| are| r) (?:won|been selected|been chosen)|congratulations.{0,40}(?:won|winner|prize|selected)|lucky winner|unclaimed (?:funds|inheritance|money)|"
      r"sassa.{0,30}(?:r ?350|srd|grant).{0,40}(?:approved|payout|unlock|backpay|release)|(?:lotto|lottery).{0,30}(?:winner|won|claim))")
_rule("WRONG_DEPOSIT", "reversal_scam", 45, "deleet",
      r"\b(?:sent|deposited|paid|transferred|loaded)\b.{0,40}\b(?:by mistake|wrongly|in error|wrong (?:number|account)|mistakenly)\b|"
      r"\b(?:by mistake|in error|wrong (?:number|account))\b.{0,60}\b(?:send (?:it )?back|refund|return|reverse|pay back)")
_rule("SECRECY", "coercion", 20, "deleet",
      r"\b(?:do not|don'?t|dont|never)\b.{0,15}\b(?:tell|inform|disclose|speak to|call)\b.{0,25}\b(?:anyone|anybody|your bank|the bank|family|staff|branch|police)")
_rule("REMOTE_ACCESS", "device_takeover", 40, "plain",
      r"\b(?:anydesk|teamviewer|quicksupport|rustdesk|ultraviewer|remote (?:access|control|support))\b")
_rule("JOB_FEE", "advance_fee", 45, "deleet",
      r"\b(?:job|vacancy|vacancies|hiring|recruit\w*|learnership|internship|placement)\b.{0,70}\b(?:pay|fee|deposit|registration|uniform|training|medical|admin)\b.{0,30}\b(?:r ?\d+|fee|first|upfront|before)|"
      r"\b(?:pay|send|deposit)\b.{0,25}\b(?:r ?\d+|fee)\b.{0,30}\b(?:registration|uniform|training|medical|admin)?.{0,30}\b(?:job|vacancy|vacancies|hiring|learnership|internship|placement|start work)\b")
_rule("INVEST_GUARANTEE", "investment_scam", 30, "deleet",
      r"\b(?:guaranteed|assured|risk[- ]?free)\b.{0,25}\b(?:returns?|profit|income|payout)\b|\b(?:double|triple|10x) your (?:money|investment)\b|"
      r"\b\d{2,3} ?% (?:returns?|profit|interest)\b.{0,15}\b(?:in|per|within)\b.{0,6}\b(?:a |one )?(?:day|week|\d+ days)")
_rule("NUMBER_SWITCH", "coercion", 15, "plain",
      r"\b(?:whats ?app|call|text|sms)\b.{0,12}\b(?:me|us|him|her|this number)\b.{0,12}(?:on|at)?\s*(?:\+27|0)[6-8]\d[\d ]{7,9}")

# Category combinations that raise the floor of the score (they rarely occur innocently).
_COMBOS = (
    ({"credential_request", "impersonation"}, 90),
    ({"credential_request", "urgency"}, 85),
    ({"credential_request", "suspicious_link"}, 85),
    ({"advance_fee", "urgency"}, 75),
    ({"impersonation", "suspicious_link"}, 80),
    ({"prize_scam", "advance_fee"}, 85),
    ({"reversal_scam", "credential_request"}, 90),
    ({"device_takeover", "impersonation"}, 90),
)

_ADVICE = {
    "credential_request": "Never share PINs, OTPs, passwords or card details with anyone, including 'bank staff'.",
    "impersonation": "Banks do not ask you to move money or 'verify' details by SMS/WhatsApp. Hang up and call the number on the back of your card.",
    "urgency": "Pressure to act immediately is a classic scam tactic. Pause and verify first.",
    "advance_fee": "Legitimate prizes, grants and jobs never require you to pay a fee or send an eWallet/voucher first.",
    "suspicious_link": "Do not open links in unexpected messages. Type your bank's address yourself or use its official app.",
    "prize_scam": "You cannot win a competition you did not enter. SASSA never asks for fees or PINs.",
    "reversal_scam": "Do not refund 'mistaken' deposits yourself. Tell your bank and let them reverse it.",
    "coercion": "Anyone telling you to keep a transaction secret from your bank or family is a red flag.",
    "device_takeover": "Never install remote-access apps at a stranger's request.",
    "investment_scam": "Guaranteed high returns do not exist. Check the provider on the FSCA register.",
}


def _verdict(score: int) -> str:
    if score >= 70: return "HIGH_RISK"
    if score >= 40: return "SUSPICIOUS"
    if score >= 15: return "LOW_RISK_SIGNALS"
    return "NO_KNOWN_PATTERNS"  # deliberately NOT "safe": absence of a match is not proof


def analyze_text(text: str) -> dict:
    """Score a pasted message. Pure function: same input -> same output; nothing stored or logged."""
    if not isinstance(text, str) or not text.strip():
        return {"score": 0, "verdict": "NO_KNOWN_PATTERNS", "categories": [], "rules": [], "advice": [], "engine": "rules-v1"}

    plain, deleet = _views(text)
    awareness = bool(_AWARE.search(deleet))
    deleet = _AWARE.sub(" ", deleet)  # "never share your PIN" is advice, not a request

    views = {"plain": plain, "deleet": deleet}
    hits = [(rid, cat, w) for rid, cat, w, view, rx in _R if rx.search(views[view])]

    # Noisy-OR: independent signals compound but can never exceed 100.
    miss = 1.0
    for _, _, w in hits:
        miss *= 1 - w / 100
    score = round((1 - miss) * 100)

    cats = {c for _, c, _ in hits}
    for combo, floor in _COMBOS:
        if combo <= cats:
            score = max(score, floor)
    score = min(score, 100)

    ordered = sorted(cats)
    return {
        "score": score,
        "verdict": _verdict(score),
        "categories": ordered,
        "rules": sorted({rid for rid, _, _ in hits}),
        "advice": [_ADVICE[c] for c in ordered if c in _ADVICE],
        "awareness_text_detected": awareness,
        "engine": "rules-v1",
    }
