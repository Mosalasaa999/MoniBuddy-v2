"""
Deterministic, rule-based scam heuristics for South African scam footprints.
No network calls, no ML/LLM, nothing logged or stored. Returns rule IDs, categories and advice only,
never the user's text, so nothing sensitive can leak through responses or logs.

Covers: fake proof-of-payment (POP) / overpayment-refund scams, urgent OTP/PIN requests, bank and
SASSA impersonation, advance fees (eWallet/vouchers), Ponzi and pyramid promises, remote-access
takeover, wrong-deposit reversal scams, shortened/lookalike links.
"""
import re
import unicodedata

MAX_CHARS = 2000  # hard cap -> bounded regex work (also guards against ReDoS)

# --- normalisation ---------------------------------------------------------
_ZERO_WIDTH = dict.fromkeys(map(ord, "​‌‍⁠﻿­"), None)
_HOMOGLYPHS = str.maketrans("аеорсхуіј", "aeopcxyij")  # common Cyrillic look-alikes
_DELEET = str.maketrans({"0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s"})
_WS = re.compile(r"\s+")


def _views(text: str):
    t = unicodedata.normalize("NFKC", text[:MAX_CHARS]).translate(_ZERO_WIDTH)
    t = _WS.sub(" ", t.lower().translate(_HOMOGLYPHS)).strip()
    # plain keeps digits (R500, 24 hours, 200%); deleet catches p1n / 0tp / ewall3t
    return t, t.translate(_DELEET)


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
_BANKS_NOSPACE = _BANKS.replace("first national bank", "firstnational").replace(" ", "")
_CASHOUT = r"(?:e-?wallet|cash ?send|1 ?voucher|ott voucher|blu ?voucher|airtime|bitcoin|gift ?card)"

# (rule_id, category, weight 0-100, view, compiled pattern) -- bounded quantifiers only
_R = []
def _rule(rid, cat, w, view, pat):
    _R.append((rid, cat, w, view, re.compile(pat, re.S)))


# ---- credential theft (OTP / PIN) -----------------------------------------
_rule("CRED_ASK_VERB", "credential_request", 45, "deleet",
      rf"\b(?:send|share|give|provide|reply(?: with)?|confirm|enter|verify|update|type|read out|forward|tell me)\b.{{0,30}}\b(?:your|ur|the|ya)?\s?{_SECRET}")
_rule("CRED_ASK_QUESTION", "credential_request", 45, "deleet",
      rf"\b(?:what(?:'s| is)|whats)\s+(?:your|ur)\s+{_SECRET}|\b(?:your|ur)\s+{_SECRET}\s+(?:is )?(?:needed|required|to (?:verify|confirm|reverse|cancel|unlock))")
_rule("OTP_RELAY", "credential_request", 55, "deleet",
      r"\b(?:send|forward|give|read|share|tell)\b.{0,25}\b(?:me|us)?\b.{0,15}\b(?:code|otp|pin|sms|message)\b.{0,30}\b(?:you (?:just |will )?(?:got|get|received|receive)|that was sent|sent to you)")
_rule("OTP_URGENT_SMS", "credential_request", 40, "deleet",
      r"\b(?:otp|one[- ]?time[- ]?(?:pin|password|code))\b.{0,40}\b(?:urgent(?:ly)?|immediately|quickly|now|asap|expires?)\b|"
      r"\b(?:urgent(?:ly)?|immediately|quickly|asap)\b.{0,40}\b(?:otp|one[- ]?time[- ]?(?:pin|password|code))\b")

# ---- fake proof-of-payment / overpayment ----------------------------------
_rule("FAKE_POP_ATTACHED", "fake_pop", 30, "deleet",
      r"\b(?:proof of payment|\bpop\b|deposit slip|payment (?:confirmation|notification|advice|receipt|screenshot)|remittance)\b.{0,60}\b(?:attached|sent|see|check|click|link|below|whats ?app)\b")
_rule("FAKE_POP_FUNDS_PENDING", "fake_pop", 35, "deleet",
      r"\b(?:funds?|money|payment|deposit)\b.{0,40}\b(?:will |should |might )?(?:reflect|clear|show|come through|be available)\b.{0,25}\b(?:in|within|after)\b.{0,6}\b(?:24|48|72|\d{1,2}) ?(?:hours?|hrs?|days?)\b|"
      r"\b(?:pending|processing)\b.{0,25}\b(?:payment|transfer|deposit|eft)\b.{0,40}\b(?:release|send|hand over|deliver|ship)\b")
_rule("FAKE_POP_RELEASE_GOODS", "fake_pop", 30, "deleet",
      r"\b(?:release|send|ship|deliver|hand over|dispatch)\b.{0,30}\b(?:goods|items?|parcel|stock|order|phone|car|vehicle|laptop)\b.{0,120}\b(?:paid|payment|pop|proof|deposited|eft)\b|"
      r"\b(?:i(?:'ve| have)? (?:paid|deposited|transferred)|payment (?:made|done|sent))\b.{0,120}\b(?:release|send|ship|deliver|dispatch)\b")
_rule("OVERPAYMENT_REFUND", "fake_pop", 50, "deleet",
      r"\b(?:overpaid|over[- ]?paid|paid too much|sent too much|extra r ?\d[\d ,.]*|r ?\d[\d ,.]* extra|paid r ?\d[\d ,.]* (?:instead of|too much))\b.{0,70}\b(?:refund|send (?:it |the (?:difference|balance|extra) )?back|return|pay (?:me )?back|difference|balance|cash ?send|e-?wallet)\b")
_rule("BANK_SMS_LOOKALIKE_CREDIT", "fake_pop", 30, "deleet",
      rf"\b(?:{_BANKS}|bank)\b.{{0,30}}\b(?:credit(?:ed)?|deposit(?:ed)?|payment received|funds? received)\b.{{0,40}}\b(?:r ?\d[\d ,.]*)\b.{{0,60}}\b(?:reference|ref|available balance|avail bal)\b.{{0,60}}\b(?:send back|refund|reverse|release|click|call)")

# ---- advance fee / prize ----------------------------------------------------
_rule("ADV_FEE", "advance_fee", 35, "deleet",
      r"\b(?:pay|send|deposit|transfer|load|buy)\b.{0,35}\b(?:r ?\d[\d ,.]*|fee|deposit)\b.{0,45}\b(?:release|unlock|claim|clear(?:ance)?|process(?:ing)?|activate|collect|insurance|admin|registration)")
_rule("EWALLET_DEMAND", "advance_fee", 40, "deleet",
      rf"\b{_CASHOUT}\b.{{0,40}}\b(?:fee|deposit|release|unlock|clearance|admin|to (?:claim|get|receive|release))|"
      rf"\b(?:fee|deposit|admin|clearance|release)\b.{{0,40}}\b(?:via|by|through|using|with|in)\b.{{0,10}}\b{_CASHOUT}")
_rule("PRIZE", "prize_scam", 35, "deleet",
      r"\b(?:you(?:'ve| have| are| r) (?:won|been selected|been chosen)|congratulations.{0,40}(?:won|winner|prize|selected)|lucky winner|unclaimed (?:funds|inheritance|money)|"
      r"sassa.{0,30}(?:r ?350|srd|grant).{0,40}(?:approved|payout|unlock|backpay|release)|(?:lotto|lottery).{0,30}(?:winner|won|claim))")
_rule("JOB_FEE", "advance_fee", 45, "deleet",
      r"\b(?:job|vacancy|vacancies|hiring|recruit\w*|learnership|internship|placement)\b.{0,70}\b(?:pay|fee|deposit|registration|uniform|training|medical|admin)\b.{0,30}\b(?:r ?\d+|fee|first|upfront|before)|"
      r"\b(?:pay|send|deposit)\b.{0,25}\b(?:r ?\d+|fee)\b.{0,30}\b(?:registration|uniform|training|medical|admin)?.{0,30}\b(?:job|vacancy|vacancies|hiring|learnership|internship|placement|start work)\b")

# ---- Ponzi / pyramid / fake stokvel investment ------------------------------
_rule("INVEST_GUARANTEE", "investment_scam", 45, "deleet",
      r"\b(?:guaranteed|assured|risk[- ]?free|100% safe)\b.{0,25}\b(?:returns?|profit|income|payout|interest)\b|"
      r"\b(?:returns?|profit|income|payout|interest|get back|money back)\b.{0,40}\b(?:guaranteed|assured|risk[- ]?free)\b|"
      r"\b(?:double|triple|10x) your (?:money|investment|cash)\b|"
      r"\b\d{2,3} ?% (?:returns?|profit|interest|growth)\b.{0,20}\b(?:in|per|within|every)\b.{0,6}\b(?:a |one |each )?(?:day|week|month|\d+ (?:days|weeks))")
_rule("IMPLAUSIBLE_RETURN", "investment_scam", 45, "deleet",
      r"\b\d{2,3} ?% (?:returns?|interest|profit|growth|roi|payouts?)\b.{0,20}\b(?:daily|every day|per day|a day|weekly|every week|per week|a week|each week)\b")
_rule("PONZI_MULTIPLE", "investment_scam", 45, "deleet",
      r"\b(?:invest|deposit|pay|send|put in|contribute)\b.{0,6}\br ?(\d[\d ,]{1,9})\b.{0,40}\b(?:get back|receive|earn|walk away with|payout|return(?:ed)?|you(?:'ll| will) get)\b.{0,10}\br ?(\d[\d ,]{1,9})\b")
_rule("PYRAMID_RECRUIT", "ponzi_recruitment", 40, "deleet",
      r"\b(?:refer|recruit|invite|bring|add|get)\b.{0,20}\b(?:friends?|family|others|people|\d+ (?:people|members|friends))\b.{0,50}\b(?:earn|bonus|commission|get paid|returns?|reward|double|paid out|move up)\b|"
      r"\b(?:earn|get paid|commission)\b.{0,30}\b(?:for )?(?:every|each|per)\b.{0,15}\b(?:referral|person|member|friend|invite)\b|\b(?:pyramid|matrix|downline|upline)\b")
_rule("FAKE_STOKVEL_INVEST", "investment_scam", 35, "deleet",
      r"\b(?:stokvel|savings? club|burial society|mashonisa|investment club)\b.{0,50}\b(?:invest(?:ment)?|returns?|interest|profit|double|10x|payout)\b.{0,40}\b(?:\d{2,3} ?%|guarantee\w*|fast|quick|weekly|daily|every (?:day|week))")
_rule("PONZI_URGENT_SPOT", "investment_scam", 20, "deleet",
      r"\b(?:limited (?:spots?|slots?|time)|last (?:spots?|slots?|chance)|closing (?:today|soon|tonight)|only \d{1,2} (?:spots?|slots?) (?:left|remaining))\b")

# ---- impersonation, urgency, coercion, links, device takeover ---------------
_rule("URGENCY", "urgency", 15, "deleet",
      r"\b(?:urgent(?:ly)?|immediately|right now|act now|asap|last warning|final notice|within \d{1,2} ?(?:hours?|hrs?|minutes?|mins?)|expires? (?:today|soon|tonight)|"
      r"(?:account|card|sim|profile)\b.{0,25}\b(?:will be |has been |is )?(?:blocked|suspended|closed|frozen|deactivated|cancelled|locked))")
_rule("BANK_IMPERSONATION", "impersonation", 30, "deleet",
      rf"\b(?:this is|i am|i'?m|we are|calling from|message from|sms from|from the|on behalf of|you are speaking (?:to|with))\b.{{0,40}}\b{_BANKS}\b.{{0,40}}\b(?:fraud|security|verification|risk|official|department|team|agent|consultant|officer|manager|investigat\w*)|"
      rf"\b{_BANKS}\b.{{0,25}}\b(?:fraud|security|risk|verification)\b.{{0,15}}\b(?:department|team|unit|officer|agent|alert)")
_rule("FAKE_ALERT", "impersonation", 25, "deleet",
      rf"\b(?:suspicious|unauthori[sz]ed|fraudulent|unusual)\b.{{0,30}}\b(?:transaction|activity|login|transfer|purchase|debit)\b|\b(?:your )?{_BANKS}\b.{{0,20}}\b(?:account|card|profile)\b.{{0,25}}\b(?:suspended|blocked|locked|on hold|compromised)")
_rule("WRONG_DEPOSIT", "reversal_scam", 45, "deleet",
      r"\b(?:sent|deposited|paid|transferred|loaded)\b.{0,40}\b(?:by mistake|wrongly|in error|wrong (?:number|account)|mistakenly)\b|"
      r"\b(?:by mistake|in error|wrong (?:number|account))\b.{0,60}\b(?:send (?:it )?back|refund|return|reverse|pay back)")
_rule("SECRECY", "coercion", 20, "deleet",
      r"\b(?:do not|don'?t|dont|never)\b.{0,15}\b(?:tell|inform|disclose|speak to|call)\b.{0,25}\b(?:anyone|anybody|your bank|the bank|family|staff|branch|police)")
_rule("REMOTE_ACCESS", "device_takeover", 40, "plain",
      r"\b(?:anydesk|teamviewer|quicksupport|rustdesk|ultraviewer|remote (?:access|control|support))\b")
_rule("LINK_SHORTENER", "suspicious_link", 20, "plain",
      r"\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|is\.gd|rb\.gy|shorturl\.at|ow\.ly|t\.ly)/\S+")
_rule("LINK_BAD_TLD", "suspicious_link", 25, "plain",
      r"https?://[^\s/]+\.(?:xyz|top|click|icu|tk|ml|cf|gq|buzz|cyou|monster|sbs|lol|work|support)\b")
_rule("LINK_LOOKALIKE", "suspicious_link", 35, "plain",
      rf"https?://[^\s/]*(?:{_BANKS_NOSPACE}[^\s/.]*-|-[^\s/.]*{_BANKS_NOSPACE})[^\s/]*")
_rule("LINK_ANY_WITH_ACTION", "suspicious_link", 10, "plain",
      r"(?:click|tap|open|visit|follow|log ?in at|update at)\b.{0,25}(?:https?://|www\.)\S+")
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
    ({"fake_pop", "suspicious_link"}, 85),
    ({"fake_pop", "urgency"}, 75),
    ({"fake_pop", "reversal_scam"}, 85),
    ({"investment_scam", "ponzi_recruitment"}, 85),
    ({"investment_scam", "urgency"}, 70),
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
    "investment_scam": "Guaranteed or very high returns do not exist. Check the provider on the FSCA register before paying anyone.",
    "fake_pop": "A proof-of-payment screenshot or SMS is not money. Only release goods or send a refund after the funds show in YOUR own bank app, and never refund an 'overpayment' by eWallet or cash send.",
    "ponzi_recruitment": "If you earn mainly by bringing in other people, it is a pyramid scheme and the people at the bottom lose their money.",
}


def _verdict(score: int) -> str:
    if score >= 70: return "HIGH_RISK"
    if score >= 40: return "SUSPICIOUS"
    if score >= 15: return "LOW_RISK_SIGNALS"
    return "NO_KNOWN_PATTERNS"  # deliberately NOT "safe": absence of a match is not proof


def analyze_text(text: str) -> dict:
    """Score a pasted message. Pure function: same input -> same output; nothing stored or logged."""
    if not isinstance(text, str) or not text.strip():
        return {"score": 0, "verdict": "NO_KNOWN_PATTERNS", "categories": [], "rules": [],
                "advice": [], "awareness_text_detected": False, "engine": "rules-v2"}

    plain, deleet = _views(text)
    awareness = bool(_AWARE.search(deleet))
    plain, deleet = _AWARE.sub(" ", plain), _AWARE.sub(" ", deleet)  # "never share your PIN" is advice

    hits = [(rid, cat, w) for rid, cat, w, view, rx in _R
            if rx.search(plain) or (view == "deleet" and rx.search(deleet))]

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
        "engine": "rules-v2",
    }

