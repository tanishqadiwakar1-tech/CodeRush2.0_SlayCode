import yaml
import os
from flask import Blueprint, jsonify, request
from models import db, Approval
import logging

logger = logging.getLogger(__name__)

procedures_bp = Blueprint('procedures', __name__)

PROCEDURES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'simulation', 'procedures')

def load_procedure(proc_id: str) -> dict | None:
    """Load a procedure YAML file by ID."""
    filepath = os.path.join(PROCEDURES_DIR, f"{proc_id}.yaml")
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return yaml.safe_load(f)
    return None

def load_all_procedures() -> list:
    """Load all procedure YAML files."""
    procedures = []
    if os.path.exists(PROCEDURES_DIR):
        for filename in os.listdir(PROCEDURES_DIR):
            if filename.endswith('.yaml'):
                filepath = os.path.join(PROCEDURES_DIR, filename)
                with open(filepath, 'r') as f:
                    procedures.append(yaml.safe_load(f))
    return procedures

@procedures_bp.route('/', methods=['GET'])
def list_procedures():
    """List all available procedures."""
    procedures = load_all_procedures()
    return jsonify({
        "success": True,
        "data": procedures
    })

@procedures_bp.route('/<proc_id>', methods=['GET'])
def get_procedure(proc_id):
    """Get a specific procedure by ID."""
    proc = load_procedure(proc_id)
    if proc:
        return jsonify({"success": True, "data": proc})
    return jsonify({"success": False, "error": "Procedure not found."}), 404

@procedures_bp.route('/propose', methods=['POST'])
def propose_procedure():
    """Propose a procedure for approval. Creates a pending approval record."""
    data = request.json
    procedure_id = data.get('procedure_id', '')
    
    proc = load_procedure(procedure_id)
    if not proc:
        return jsonify({"success": False, "error": "Procedure not found."}), 404
    
    # Generate a unique command ID
    import uuid
    command_id = f"CMD-{uuid.uuid4().hex[:6].upper()}"
    
    approval = Approval(
        command_id=command_id,
        procedure_id=procedure_id,
        status='PENDING_APPROVAL'
    )
    db.session.add(approval)
    db.session.commit()
    
    logger.info(f"Procedure {procedure_id} proposed as command {command_id}")
    
    return jsonify({
        "success": True,
        "data": {
            "command_id": command_id,
            "procedure": proc,
            "status": "PENDING_APPROVAL"
        }
    })
