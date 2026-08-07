from .base import db
from datetime import datetime, timezone

class Approval(db.Model):
    __tablename__ = 'approvals'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    command_id = db.Column(db.String(50), nullable=False, unique=True)
    procedure_id = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='PENDING_APPROVAL') # PROPOSED, VALIDATED, PENDING_APPROVAL, APPROVED, REJECTED, EXECUTED
    operator = db.Column(db.String(100), nullable=True)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "command_id": self.command_id,
            "procedure_id": self.procedure_id,
            "status": self.status,
            "operator": self.operator,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() + "Z" if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() + "Z" if self.resolved_at else None
        }
