"""
Space Mission Operations Automator — Flask Application Entry Point.

SIMULATION-ONLY ENVIRONMENT — NOT CONNECTED TO ANY LIVE SPACECRAFT.
All commands are simulated artifacts. No real spacecraft interfaces.
"""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from apscheduler.schedulers.background import BackgroundScheduler
from models import db
from config import Config
import logging

# ── Logging ──────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# ── SocketIO ─────────────────────────────────────────────────────────
socketio = SocketIO(cors_allowed_origins="*", async_mode='threading')

# ── Scheduler ────────────────────────────────────────────────────────
scheduler = BackgroundScheduler(daemon=True)


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=app.config['CORS_ORIGINS'])
    db.init_app(app)
    socketio.init_app(app)

    # ── Register Blueprints ──────────────────────────────────────────
    from blueprints import (
        telemetry_bp, planner_bp, faults_bp, anomalies_bp,
        procedures_bp, approvals_bp, replay_bp, metrics_bp,
        dataset_bp
    )
    app.register_blueprint(telemetry_bp,  url_prefix='/api/telemetry')
    app.register_blueprint(planner_bp,    url_prefix='/api/planner')
    app.register_blueprint(faults_bp,     url_prefix='/api/faults')
    app.register_blueprint(anomalies_bp,  url_prefix='/api/anomalies')
    app.register_blueprint(procedures_bp, url_prefix='/api/procedures')
    app.register_blueprint(approvals_bp,  url_prefix='/api/approvals')
    app.register_blueprint(replay_bp,     url_prefix='/api/replay')
    app.register_blueprint(metrics_bp,    url_prefix='/api/metrics')
    app.register_blueprint(dataset_bp,    url_prefix='/api/dataset')

    # ── Create DB tables & seed demo data ────────────────────────────
    with app.app_context():
        db.create_all()
        from services.demo_seeder import seed_demo_plan
        seed_demo_plan()

    # ── Health endpoint ──────────────────────────────────────────────
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "healthy",
            "service": "Space Mission Operations Automator",
            "mode": "SIMULATION ONLY"
        })

    # ── SocketIO events ──────────────────────────────────────────────
    @socketio.on('connect')
    def handle_connect():
        from services.digital_twin import digital_twin
        socketio.emit('twin_state', digital_twin.get_state())
        logger.info("Client connected to telemetry stream.")

    return app


# ── Application instance ────────────────────────────────────────────
app = create_app()


def _telemetry_tick():
    """Called every second by the scheduler."""
    from services.telemetry_simulator import generate_telemetry
    from services.fault_injector import check_auto_fault_injection
    generate_telemetry(app, socketio)
    check_auto_fault_injection(app, socketio)


if __name__ == '__main__':
    logger.info("╔═══════════════════════════════════════════════════════════╗")
    logger.info("║  SIMULATION-ONLY ENVIRONMENT                            ║")
    logger.info("║  NOT CONNECTED TO ANY LIVE SPACECRAFT                   ║")
    logger.info("╚═══════════════════════════════════════════════════════════╝")

    scheduler.add_job(_telemetry_tick, 'interval', seconds=1, id='telemetry_tick')
    scheduler.start()

    socketio.run(app, host='0.0.0.0', port=5000, debug=False, allow_unsafe_werkzeug=True)
