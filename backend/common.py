"""Shared helpers: error type, JSON body parsing, time."""
from datetime import datetime, timezone
from flask import request


class ApiError(Exception):
    def __init__(self, status, code, message):
        super().__init__(message)
        self.status, self.code, self.message = status, code, message


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def json_body() -> dict:
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise ApiError(400, "BAD_JSON", "Body must be a JSON object.")
    return data
