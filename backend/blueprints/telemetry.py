from flask import Blueprint, jsonify
from models import Telemetry

telemetry_bp = Blueprint('telemetry', __name__)

@telemetry_bp.route('/live', methods=['GET'])
def get_live_telemetry():
    latest = Telemetry.query.order_by(Telemetry.id.desc()).first()
    return jsonify({
        "success": True,
        "data": latest.to_dict() if latest else None
    })

@telemetry_bp.route('/history', methods=['GET'])
def get_history():
    history = Telemetry.query.order_by(Telemetry.id.desc()).limit(100).all()
    return jsonify({
        "success": True,
        "data": [t.to_dict() for t in history]
    })
