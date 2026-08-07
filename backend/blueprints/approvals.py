from flask import Blueprint, jsonify, request
from models import db, Approval
from services.digital_twin import digital_twin
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

approvals_bp = Blueprint('approvals', __name__)

@approvals_bp.route('/pending', methods=['GET'])
def get_pending():
    """Return all commands awaiting operator approval."""
    pending = Approval.query.filter_by(status='PENDING_APPROVAL').order_by(Approval.created_at.desc()).all()
    return jsonify({
        "success": True,
        "data": [a.to_dict() for a in pending]
    })

@approvals_bp.route('/all', methods=['GET'])
def get_all():
    """Return all approvals."""
    approvals = Approval.query.order_by(Approval.created_at.desc()).all()
    return jsonify({
        "success": True,
        "data": [a.to_dict() for a in approvals]
    })

@approvals_bp.route('/<command_id>', methods=['POST'])
def handle_approval(command_id):
    """Approve or reject a pending command."""
    data = request.json
    approved = data.get('approved', False)
    operator = data.get('operator', 'anonymous-operator')
    comment = data.get('comment', '')
    
    approval = Approval.query.filter_by(command_id=command_id).first()
    if not approval:
        return jsonify({"success": False, "error": "Command not found."}), 404
    
    if approval.status != 'PENDING_APPROVAL':
        return jsonify({"success": False, "error": f"Command is in state '{approval.status}', not PENDING_APPROVAL."}), 400
    
    approval.operator = operator
    approval.comment = comment
    approval.resolved_at = datetime.now(timezone.utc)
    
    if approved:
        approval.status = 'APPROVED'
        logger.info(f"Command {command_id} APPROVED by {operator}")
        
        # Execute the simulated procedure effect
        if approval.procedure_id == 'PROC-BATT-THERMAL-01':
            digital_twin.mitigate_fault('battery_thermal_runaway')
            logger.info("Executed mitigation: battery thermal runaway fault cleared.")
        
        approval.status = 'EXECUTED'
    else:
        approval.status = 'REJECTED'
        logger.info(f"Command {command_id} REJECTED by {operator}")
    
    db.session.commit()
    
    return jsonify({
        "success": True,
        "data": approval.to_dict()
    })
