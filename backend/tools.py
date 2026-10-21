from flask import Blueprint, jsonify
from common import ApiError, json_body
from scam_checker import analyze_text, MAX_CHARS

bp = Blueprint("tools", __name__, url_prefix="/api/v1")


@bp.post("/scam-check")
def scam_check():
    """Stateless: text is analysed in memory and discarded. Never log request bodies on this route."""
    text = json_body().get("text")
    if not isinstance(text, str) or not text.strip():
        raise ApiError(400, "INVALID_FIELD", "text is required.")
    if len(text) > MAX_CHARS:
        raise ApiError(413, "TOO_LONG", f"Max {MAX_CHARS} characters.")
    return jsonify(analyze_text(text))


@bp.get("/health")
def health():
    return jsonify(status="ok", mode="ledger-only")
