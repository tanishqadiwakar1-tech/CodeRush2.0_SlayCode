"""Automatic fault injection based on mission config demo scenario."""
from services.digital_twin import digital_twin
from models import db, Approval
import logging
import json

logger = logging.getLogger(__name__)

_fault_injected = False

def check_auto_fault_injection(app, socketio):
    """Check if the demo scenario fault should be injected at T+180s."""
    global _fault_injected
    with app.app_context():
        state = digital_twin.get_state()
        mission_time = state['mission_time']

        if mission_time >= 180 and not _fault_injected:
            digital_twin.inject_fault('battery_thermal_runaway')
            _fault_injected = True
            logger.warning("AUTO DEMO: Battery thermal runaway fault injected at T+180s")
            socketio.emit('system_message', {
                "type": "FAULT_INJECTED",
                "message": "Demo fault injected: battery_thermal_runaway at T+180s",
                "mission_time": mission_time
            })

        # Auto-propose procedure when anomaly is detected and no pending approval exists
        if mission_time >= 185 and _fault_injected:
            from models import Anomaly
            anomaly = Anomaly.query.filter_by(anomaly_id='ANOM-BATT-01', resolved=False).first()
            if anomaly:
                existing_approval = Approval.query.filter_by(
                    procedure_id='PROC-BATT-THERMAL-01'
                ).first()
                if not existing_approval:
                    approval = Approval(
                        command_id='CMD-DEMO-001',
                        procedure_id='PROC-BATT-THERMAL-01',
                        status='PENDING_APPROVAL'
                    )
                    db.session.add(approval)
                    db.session.commit()
                    logger.info("AUTO DEMO: Procedure PROC-BATT-THERMAL-01 proposed for approval.")
                    socketio.emit('approval_pending', approval.to_dict())
