from flask import Blueprint, jsonify
from models import Anomaly

anomalies_bp = Blueprint('anomalies', __name__)

@anomalies_bp.route('/', methods=['GET'])
def get_anomalies():
    """Return all detected anomalies, most recent first."""
    anomalies = Anomaly.query.order_by(Anomaly.detected_at.desc()).all()
    return jsonify({
        "success": True,
        "data": [a.to_dict() for a in anomalies]
    })

@anomalies_bp.route('/active', methods=['GET'])
def get_active_anomalies():
    """Return only unresolved anomalies."""
    anomalies = Anomaly.query.filter_by(resolved=False).order_by(Anomaly.detected_at.desc()).all()
    return jsonify({
        "success": True,
        "data": [a.to_dict() for a in anomalies]
    })
