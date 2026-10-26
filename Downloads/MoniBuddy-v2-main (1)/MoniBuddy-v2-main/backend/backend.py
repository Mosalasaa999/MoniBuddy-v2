import re
from flask import Flask, request, jsonify

app = Flask(__name__)

# Pre-compiled Regex for sub-10ms evaluation
EWALLET_PATTERN = re.compile(r"(?i)FNB.*eWallet.*dial\s*\*120\*277#.*get.*PIN")
CAPITEC_PATTERN = re.compile(r"(?i)Capitec:\s*Payment\s*of\s*R\d+\.\d{2}\s*to\s*.*Ref:.*")

def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def jaro_winkler(s1, s2):
    if not s1 or not s2: return 0.0
    if s1 == s2: return 1.0
    
    match_bound = max(len(s1), len(s2)) // 2 - 1
    matches = 0
    matches_s1 = [False] * len(s1)
    matches_s2 = [False] * len(s2)
    
    for i, c1 in enumerate(s1):
        start = max(0, i - match_bound)
        end = min(len(s2), i + match_bound + 1)
        for j in range(start, end):
            if not matches_s2[j] and c1 == s2[j]:
                matches_s1[i] = True
                matches_s2[j] = True
                matches += 1
                break
    if matches == 0: return 0.0
        
    transpositions = 0
    k = 0
    for i, c1 in enumerate(s1):
        if matches_s1[i]:
            while not matches_s2[k]: k += 1
            if c1 != s2[k]: transpositions += 1
            k += 1
            
    jaro = (matches / len(s1) + matches / len(s2) + (matches - transpositions / 2) / matches) / 3.0
    
    prefix = 0
    for i in range(min(4, min(len(s1), len(s2)))):
        if s1[i] == s2[i]: prefix += 1
        else: break
            
    return jaro + (prefix * 0.1 * (1.0 - jaro))

@app.route('/api/v1/threat-engine', methods=['POST'])
def threat_engine():
    try:
        data = request.get_json() or {}
        sender = data.get('sender', '').strip().upper()
        body = data.get('body', '').strip()
        
        jw_capitec = jaro_winkler(sender, "CAPITEC")
        jw_fnb = jaro_winkler(sender, "FNB")
        
        is_impersonator = (0.85 < jw_capitec < 1.0) or (0.85 < jw_fnb < 1.0)
        
        if is_impersonator:
            return jsonify({"status": "DANGER", "reason": "SENDER_SPOOF"}), 200
            
        if "EWALLET" in body.upper() or "*120*277#" in body:
            if not EWALLET_PATTERN.search(body):
                return jsonify({"status": "DANGER", "reason": "MALFORMED_EWALLET_STRUCTURE"}), 200
                
        if "CAPITEC" in body.upper() and "PAYMENT OF" in body.upper():
            if not CAPITEC_PATTERN.search(body):
                return jsonify({"status": "DANGER", "reason": "MALFORMED_CAPITEC_STRUCTURE"}), 200
                
        return jsonify({"status": "SAFE"}), 200
        
    except Exception:
        # Decoupled, non-blocking fallback response for when local server hangs
        return jsonify({"status": "SAFE", "reason": "FALLBACK_ENGINE_ERROR"}), 200

if __name__ == '__main__':
    app.run(port=5000, host='127.0.0.1', threaded=True)
          
