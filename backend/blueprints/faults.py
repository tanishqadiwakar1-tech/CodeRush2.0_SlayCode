from flask import Blueprint, jsonify, request
from models import db, Anomaly
from services.digital_twin import digital_twin
import logging

logger = logging.getLogger(__name__)

faults_bp = Blueprint('faults', __name__)

FAULT_CATALOG = {
    "battery_thermal_runaway": {
        "description": "Simulates battery thermal excursion causing rising temperatures.",
        "severity": "HIGH"
    },
    "sensor_drift": {
        "description": "Simulates gradual sensor drift on temperature readings.",
        "severity": "MEDIUM"
    },
    "power_excursion": {
        "description": "Simulates unexpected power draw from instruments.",
        "severity": "HIGH"
    }
}

@faults_bp.route('/inject', methods=['POST'])
def inject_fault():
    """Inject a fault into the simulation."""
    data = request.json
    fault_type = data.get('fault_type', 'battery_thermal_runaway')
    
    if fault_type not in FAULT_CATALOG:
        return jsonify({"success": False, "error": f"Unknown fault type: {fault_type}"}), 400
    
    result = digital_twin.inject_fault(fault_type)
    if result:
        logger.warning(f"FAULT INJECTED: {fault_type}")
        return jsonify({
            "success": True,
            "data": {
                "fault_type": fault_type,
                "description": FAULT_CATALOG[fault_type]["description"],
                "message": "Fault injected into simulation."
            }
        })
    return jsonify({"success": False, "error": "Failed to inject fault."}), 500

@faults_bp.route('/catalog', methods=['GET'])
def get_fault_catalog():
    """Return available fault types."""
    return jsonify({
        "success": True,
        "data": FAULT_CATALOG
    })

@faults_bp.route('/active', methods=['GET'])
def get_active_faults():
    """Return currently active faults."""
    active = {k: v for k, v in digital_twin.faults.items() if v}
    return jsonify({
        "success": True,
        "data": active
    })
