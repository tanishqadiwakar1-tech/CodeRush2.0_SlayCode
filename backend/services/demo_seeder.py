"""Seeds the initial demo mission plan into the database."""
from models import db, Activity
from datetime import datetime, timezone, timedelta
import logging

logger = logging.getLogger(__name__)

def seed_demo_plan():
    """Populate the database with the initial demo mission activities."""
    existing = Activity.query.first()
    if existing:
        logger.info("Demo plan already seeded, skipping.")
        return

    base_time = datetime.now(timezone.utc)
    activities = [
        Activity(
            name="OBSERVE_TARGET_A",
            start_time=base_time + timedelta(seconds=30),
            end_time=base_time + timedelta(seconds=120),
            reason="Camera observation of Target A while solar illumination is optimal.",
            status="SCHEDULED"
        ),
        Activity(
            name="COMPRESS_SCIENCE_DATA",
            start_time=base_time + timedelta(seconds=130),
            end_time=base_time + timedelta(seconds=200),
            reason="Compress observation data to reduce storage and downlink time.",
            status="SCHEDULED"
        ),
        Activity(
            name="DOWNLINK_SCIENCE_DATA",
            start_time=base_time + timedelta(seconds=210),
            end_time=base_time + timedelta(seconds=360),
            reason="Downlink compressed data during next communication window with DSN-Goldstone.",
            status="SCHEDULED"
        ),
        Activity(
            name="CALIBRATE_CAMERA",
            start_time=base_time + timedelta(seconds=400),
            end_time=base_time + timedelta(seconds=500),
            reason="Post-observation camera calibration for data quality assurance.",
            status="SCHEDULED"
        ),
    ]
    for a in activities:
        db.session.add(a)
    db.session.commit()
    logger.info("Demo plan seeded with 4 activities.")
