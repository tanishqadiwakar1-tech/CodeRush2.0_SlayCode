from flask import Blueprint, jsonify, request
from models import Activity

planner_bp = Blueprint('planner', __name__)

@planner_bp.route('/plan', methods=['POST'])
def generate_plan():
    goals = request.json.get('goals', [])
    # Simplified simulation logic for the demo
    return jsonify({
        "success": True,
        "data": {"message": "Plan generated successfully."}
    })

@planner_bp.route('/timeline', methods=['GET'])
def get_timeline():
    activities = Activity.query.order_by(Activity.start_time.asc()).all()
    return jsonify({
        "success": True,
        "data": [a.to_dict() for a in activities]
    })
