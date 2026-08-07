from flask import Blueprint, jsonify, request
from services.dataset_loader import DatasetLoader
from services.digital_twin import digital_twin

dataset_bp = Blueprint('dataset', __name__)

@dataset_bp.route('/list', methods=['GET'])
def list_datasets():
    """List available telemetry datasets."""
    datasets = DatasetLoader.list_available_datasets()
    return jsonify({"success": True, "data": datasets})

@dataset_bp.route('/load', methods=['POST'])
def load_dataset():
    """Load a dataset by filename into digital twin simulator."""
    data = request.json or {}
    filename = data.get('filename', 'sample_telemetry.json')
    try:
        count = DatasetLoader.load_dataset_file(filename)
        return jsonify({
            "success": True,
            "data": {
                "message": f"Successfully loaded dataset '{filename}'",
                "records_count": count,
                "dataset_name": filename
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@dataset_bp.route('/status', methods=['GET'])
def get_status():
    """Get current dataset playback status."""
    state = digital_twin.get_state()
    return jsonify({
        "success": True,
        "data": {
            "dataset_mode": state["dataset_mode"],
            "dataset_name": state["dataset_name"],
            "mission_time": state["mission_time"]
        }
    })

@dataset_bp.route('/stop', methods=['POST'])
def stop_dataset():
    """Stop dataset replay and return to dynamic physics simulation."""
    DatasetLoader.stop_dataset()
    return jsonify({"success": True, "data": {"message": "Reverted to dynamic physics simulation."}})
