from .base import db
from datetime import datetime, timezone
import json

class Anomaly(db.Model):
    __tablename__ = 'anomalies'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    anomaly_id = db.Column(db.String(50), nullable=False, unique=True)
    severity = db.Column(db.String(20), nullable=False)
    detected_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    evidence = db.Column(db.Text, nullable=False) # JSON list
    hypotheses = db.Column(db.Text, nullable=False) # JSON list of dicts
    recommended_procedure = db.Column(db.String(100), nullable=True)
    resolved = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "anomaly_id": self.anomaly_id,
            "severity": self.severity,
            "detected_at": self.detected_at.isoformat() + "Z" if self.detected_at else None,
            "evidence": json.loads(self.evidence),
            "hypotheses": json.loads(self.hypotheses),
            "recommended_procedure": self.recommended_procedure,
            "resolved": self.resolved
        }
