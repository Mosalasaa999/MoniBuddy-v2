from flask import Flask, jsonify
from flask_cors import CORS

from app.routes.sync import bp as sync_bp
from app.services.stokvel_ledger import LedgerError

# Vite dev server (the frontend runs on 5173); add others here if the frontend port changes.
ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 512 * 1024
    CORS(app, origins=ALLOWED_ORIGINS)
    app.register_blueprint(sync_bp)

    @app.errorhandler(LedgerError)
    def _bad_input(e):
        status = 413 if e.code == "TOO_LONG" else 400
        return jsonify(error={"code": e.code, "message": e.message}), status

    @app.errorhandler(404)
    def _404(_):
        return jsonify(error={"code": "NOT_FOUND", "message": "No such route."}), 404

    @app.errorhandler(405)
    def _405(_):
        return jsonify(error={"code": "METHOD_NOT_ALLOWED", "message": "Method not allowed."}), 405

    @app.errorhandler(413)
    def _413(_):
        return jsonify(error={"code": "TOO_LARGE", "message": "Request too large."}), 413

    @app.after_request
    def _headers(r):
        r.headers["Cache-Control"] = "no-store"
        r.headers["X-Content-Type-Options"] = "nosniff"
        return r

    return app

