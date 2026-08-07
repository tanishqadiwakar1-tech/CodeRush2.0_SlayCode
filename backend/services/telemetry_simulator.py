import json
from .digital_twin import digital_twin
from models import db, Telemetry, Anomaly
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

def generate_telemetry(app, socketio):
    with app.app_context():
        # Update the simulation physics
        digital_twin.update()
        
        # Get current state
        state = digital_twin.get_state()
        
        # Format list state attributes for DB storage
        db_state = {
            "battery_soc": state["battery_soc"],
            "battery_temp": state["battery_temp"],
            "bus_voltage": state["bus_voltage"],
            "storage_used_gb": state["storage_used_gb"],
            "solar_generation_w": state["solar_generation_w"],
            "antenna_visible": state["antenna_visible"],
            "pointing_mode": state["pointing_mode"],
            "mission_time": state["mission_time"],
            "position_km": json.dumps(state["position_km"]),
            "velocity_kms": json.dumps(state["velocity_kms"]),
        }
        
        # Create a DB record
        telemetry_record = Telemetry(**db_state)
        db.session.add(telemetry_record)
        
        # Anomaly detection check
        if state['battery_temp'] > 35.0:
            active_anomaly = Anomaly.query.filter_by(resolved=False, anomaly_id='ANOM-BATT-01').first()
            if not active_anomaly:
                new_anomaly = Anomaly(
                    anomaly_id='ANOM-BATT-01',
                    severity='HIGH',
                    evidence=json.dumps([
                        "battery_temp exceeded upper limit (>35.0°C)",
                        "temperature trend rising rapidly"
                    ]),
                    hypotheses=json.dumps([
                        {"name": "THERMAL_SENSOR_DRIFT", "confidence": 0.31},
                        {"name": "BATTERY_THERMAL_RUNAWAY", "confidence": 0.69}
                    ]),
                    recommended_procedure="PROC-BATT-THERMAL-01"
                )
                db.session.add(new_anomaly)
                db.session.commit()
                socketio.emit('anomaly_alert', new_anomaly.to_dict())
                logger.warning(f"Anomaly detected: {new_anomaly.anomaly_id}")
        
        db.session.commit()
        
        # Emit formatted packet via SocketIO
        socketio.emit('telemetry_update', telemetry_record.to_dict())
        socketio.emit('telemetry:update', telemetry_record.to_dict())
