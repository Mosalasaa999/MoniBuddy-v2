"""JSON routes for the local, stateless MoniBuddy backend.

A SQLite/storage adapter may call the pure services, but this blueprint itself
never opens a database or persists request data.
"""
from __future__ import annotations

from flask import Blueprint, jsonify, request

from app.services.scam_parser import analyze_message
from app.services.stokvel_ledger import (
    LedgerValidationError,
    project_ledger,
    reconcile_events,
)

bp = Blueprint("sync", __name__, url_prefix="/api/v1")
MAX_BATCH_EVENTS = 5_000


def _json_object():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, (jsonify(error="Request body must be a JSON object"), 400)
    return payload, None


@bp.post("/ledger/project")
def ledger_project():
    """Project the caller's stored event stream; no shared state is retained."""
    payload, error = _json_object()
    if error:
        return error
    events = payload.get("events")
    if not isinstance(events, list):
        return jsonify(error="events must be a JSON array"), 400
    try:
        result = project_ledger(events)
    except LedgerValidationError as exc:
        return jsonify(error=str(exc)), 400
    return jsonify(result), 200


@bp.post("/sync/reconcile")
def sync_reconcile():
    """Validate offline events against a canonical snapshot.

    The endpoint returns append candidates only. The storage owner (Mosa's
    SQLite layer) must atomically deduplicate and append them, then retry with
    the new canonical snapshot after concurrent updates.
    """
    payload, error = _json_object()
    if error:
        return error
    canonical = payload.get("canonical_events", [])
    pending = payload.get("pending_events", [])
    if not isinstance(canonical, list) or not isinstance(pending, list):
        return jsonify(error="canonical_events and pending_events must be arrays"), 400
    if len(canonical) + len(pending) > MAX_BATCH_EVENTS:
        return jsonify(error=f"combined event limit is {MAX_BATCH_EVENTS}"), 413
    try:
        result = reconcile_events(canonical, pending)
    except LedgerValidationError as exc:
        return jsonify(error=str(exc)), 409
    return jsonify(result), 200


@bp.post("/scam/check")
def scam_check():
    """Run local deterministic checks without persisting or echoing submitted text."""
    payload, error = _json_object()
    if error:
        return error
    try:
        result = analyze_message(
            sender=payload.get("sender", ""),
            message=payload.get("message", ""),
        )
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    return jsonify(result), 200

