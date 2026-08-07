from flask import Blueprint, jsonify
from models import db, Telemetry, Anomaly, Approval, Activity
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)

replay_bp = Blueprint('replay', __name__)

@replay_bp.route('/events', methods=['GET'])
def get_events():
    """Return a unified timeline of all recorded events for replay."""
    events = []

    # Collect anomalies
    anomalies = Anomaly.query.order_by(Anomaly.detected_at.asc()).all()
    for a in anomalies:
        events.append({
            "event_id": f"ANOM-{a.id}",
            "type": "ANOMALY",
            "timestamp": a.detected_at.isoformat() + "Z" if a.detected_at else None,
            "summary": f"Anomaly {a.anomaly_id} detected (severity: {a.severity})",
            "details": a.to_dict()
        })

    # Collect approvals
    approvals = Approval.query.order_by(Approval.created_at.asc()).all()
    for ap in approvals:
        events.append({
            "event_id": f"CMD-{ap.id}",
            "type": "APPROVAL",
            "timestamp": ap.created_at.isoformat() + "Z" if ap.created_at else None,
            "summary": f"Command {ap.command_id} — Status: {ap.status}",
            "details": ap.to_dict()
        })

    # Collect activities
    activities = Activity.query.order_by(Activity.start_time.asc()).all()
    for act in activities:
        events.append({
            "event_id": f"ACT-{act.id}",
            "type": "ACTIVITY",
            "timestamp": act.start_time.isoformat() + "Z" if act.start_time else None,
            "summary": f"Activity: {act.name} ({act.status})",
            "details": act.to_dict()
        })

    # Sort by timestamp
    events.sort(key=lambda x: x.get("timestamp", ""))

    return jsonify({
        "success": True,
        "data": events
    })

@replay_bp.route('/<event_id>', methods=['GET'])
def get_event(event_id):
    """Retrieve details for a single replay event."""
    prefix = event_id.split('-')[0]
    record_id = event_id.split('-')[1] if '-' in event_id else None

    if not record_id:
        return jsonify({"success": False, "error": "Invalid event ID format."}), 400

    try:
        record_id = int(record_id)
    except ValueError:
        return jsonify({"success": False, "error": "Invalid event ID."}), 400

    if prefix == 'ANOM':
        record = Anomaly.query.get(record_id)
        if record:
            return jsonify({"success": True, "data": record.to_dict()})
    elif prefix == 'CMD':
        record = Approval.query.get(record_id)
        if record:
            return jsonify({"success": True, "data": record.to_dict()})
    elif prefix == 'ACT':
        record = Activity.query.get(record_id)
        if record:
            return jsonify({"success": True, "data": record.to_dict()})

    return jsonify({"success": False, "error": "Event not found."}), 404
