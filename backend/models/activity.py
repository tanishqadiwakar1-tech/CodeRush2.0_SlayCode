from .base import db
from datetime import datetime, timezone

class Activity(db.Model):
    __tablename__ = 'activities'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(50), default='SCHEDULED') # SCHEDULED, ACTIVE, COMPLETED

    def to_dict(self):
        return {
            "id": self.id,
            "activity": self.name,
            "start": self.start_time.isoformat() + "Z" if self.start_time else None,
            "end": self.end_time.isoformat() + "Z" if self.end_time else None,
            "reason": self.reason,
            "status": self.status
        }
