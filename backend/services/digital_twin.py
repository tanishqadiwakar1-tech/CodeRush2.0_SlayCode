import threading

class DigitalTwinState:
    def __init__(self):
        self.lock = threading.Lock()
        
        # Initial State
        self.battery_soc = 95.0
        self.battery_temp = 20.0
        self.bus_voltage = 28.0
        self.storage_used_gb = 10.0
        self.solar_generation_w = 150.0
        self.antenna_visible = True
        self.pointing_mode = 'EARTH_TRACK'
        self.mission_time = 0
        
        # Orbital parameters (3D position and velocity)
        self.position_km = [7000.0, 0.0, 500.0]
        self.velocity_kms = [0.0, 7.5, 0.0]
        
        # Dataset loader state
        self.dataset_records = []
        self.dataset_index = 0
        self.dataset_mode = False  # True when dataset mode active
        self.dataset_name = None
        
        # Fault tracking
        self.faults = {
            'battery_thermal_runaway': False,
            'sensor_drift': False,
            'power_excursion': False
        }

    def get_state(self):
        with self.lock:
            return {
                "battery_soc": self.battery_soc,
                "battery_temp": self.battery_temp,
                "bus_voltage": self.bus_voltage,
                "storage_used_gb": self.storage_used_gb,
                "solar_generation_w": self.solar_generation_w,
                "antenna_visible": self.antenna_visible,
                "pointing_mode": self.pointing_mode,
                "mission_time": self.mission_time,
                "position_km": self.position_km,
                "velocity_kms": self.velocity_kms,
                "dataset_mode": self.dataset_mode,
                "dataset_name": self.dataset_name
            }

    def inject_fault(self, fault_type):
        with self.lock:
            if fault_type in self.faults:
                self.faults[fault_type] = True
                return True
            return False

    def mitigate_fault(self, fault_type):
        with self.lock:
            if fault_type in self.faults:
                self.faults[fault_type] = False
                return True
            return False

    def load_dataset(self, records, dataset_name):
        with self.lock:
            self.dataset_records = records
            self.dataset_index = 0
            self.dataset_mode = True
            self.dataset_name = dataset_name
            if records:
                self.apply_record(records[0])

    def stop_dataset(self):
        with self.lock:
            self.dataset_mode = False
            self.dataset_records = []
            self.dataset_index = 0
            self.dataset_name = None

    def apply_record(self, rec):
        """Apply a single dataset record to current state."""
        self.battery_soc = rec.get("battery_soc", self.battery_soc)
        self.battery_temp = rec.get("battery_temp", self.battery_temp)
        self.solar_generation_w = rec.get("solar_power_w", rec.get("solar_generation_w", self.solar_generation_w))
        self.storage_used_gb = rec.get("storage_used_gb", self.storage_used_gb)
        self.pointing_mode = rec.get("pointing_mode", self.pointing_mode)
        self.antenna_visible = rec.get("comm_window", self.antenna_visible)
        if "position_km" in rec:
            self.position_km = rec["position_km"]
        if "velocity_kms" in rec:
            self.velocity_kms = rec["velocity_kms"]

    def update(self):
        with self.lock:
            self.mission_time += 1
            
            if self.dataset_mode and self.dataset_records:
                # Advance through dataset
                self.dataset_index = (self.dataset_index + 1) % len(self.dataset_records)
                rec = self.dataset_records[self.dataset_index]
                self.apply_record(rec)
            else:
                # Dynamic orbital physics simulation (simple circular orbit calculation)
                import math
                omega = 0.0011  # angular velocity rad/s for ~7000km orbit
                t = self.mission_time
                r = 7000.0
                self.position_km = [
                    r * math.cos(omega * t),
                    r * math.sin(omega * t),
                    500.0 * math.sin(omega * t * 0.5)
                ]
                self.velocity_kms = [
                    -r * omega * math.sin(omega * t),
                    r * omega * math.cos(omega * t),
                    250.0 * omega * math.cos(omega * t * 0.5)
                ]

                # Simulated physics
                if self.pointing_mode == 'SUN_POINTING':
                    self.solar_generation_w = 150.0
                    self.battery_soc = min(100.0, self.battery_soc + 0.1)
                else:
                    self.solar_generation_w = 120.0
                    self.battery_soc = max(0.0, self.battery_soc - 0.05)

            # Apply fault overrides if active
            if self.faults['battery_thermal_runaway']:
                self.battery_temp += 0.5
                self.bus_voltage = max(24.0, self.bus_voltage - 0.1)
            else:
                if self.battery_temp > 20.0:
                    self.battery_temp -= 0.05
                elif self.battery_temp < 20.0:
                    self.battery_temp += 0.05

digital_twin = DigitalTwinState()
