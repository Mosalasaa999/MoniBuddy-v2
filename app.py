from flask import Flask, jsonify
from common import ApiError
import stokvel, tools


def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 64 * 1024
    app.register_blueprint(stokvel.bp)
    app.register_blueprint(tools.bp)

    @app.errorhandler(ApiError)
    def _api(e): return jsonify(error={"code": e.code, "message": e.message}), e.status

    @app.errorhandler(404)
    def _404(_): return jsonify(error={"code": "NOT_FOUND", "message": "No such route."}), 404

    @app.errorhandler(405)
    def _405(_): return jsonify(error={"code": "METHOD_NOT_ALLOWED", "message": "Method not allowed."}), 405

    @app.errorhandler(413)
    def _413(_): return jsonify(error={"code": "TOO_LARGE", "message": "Request too large."}), 413

    @app.after_request
    def _headers(r):
        r.headers["Cache-Control"] = "no-store"
        r.headers["X-Content-Type-Options"] = "nosniff"
        return r
    return app


if __name__ == "__main__":
    create_app().run(port=5000)  # dev only; use gunicorn behind TLS in production
