from .base import db
from datetime import datetime, timezone
import json

class Telemetry(db.Model):
    __tablename__ = 'telemetry'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    battery_soc = db.Column(db.Float, nullable=False)
    battery_temp = db.Column(db.Float, nullable=False)
    bus_voltage = db.Column(db.Float, nullable=False)
    storage_used_gb = db.Column(db.Float, nullable=False)
    solar_generation_w = db.Column(db.Float, nullable=False)
    antenna_visible = db.Column(db.Boolean, nullable=False, default=False)
    pointing_mode = db.Column(db.String(50), nullable=False, default='EARTH_TRACK')
    mission_time = db.Column(db.Integer, nullable=False, default=0)
    position_km = db.Column(db.Text, nullable=True)   # JSON string [x,y,z]
    velocity_kms = db.Column(db.Text, nullable=True)  # JSON string [vx,vy,vz]

    def to_dict(self):
        pos = json.loads(self.position_km) if self.position_km else [7000.0, 0.0, 500.0]
        vel = json.loads(self.velocity_kms) if self.velocity_kms else [0.0, 7.5, 0.0]
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() + "Z" if self.timestamp else None,
            "battery_soc": self.battery_soc,
            "battery_temp": self.battery_temp,
            "bus_voltage": self.bus_voltage,
            "storage_used_gb": self.storage_used_gb,
            "solar_generation_w": self.solar_generation_w,
            "antenna_visible": self.antenna_visible,
            "pointing_mode": self.pointing_mode,
            "mission_time": self.mission_time,
            "position_km": pos,
            "velocity_kms": vel
        }
