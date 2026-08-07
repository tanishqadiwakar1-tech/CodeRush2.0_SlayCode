import json
import os
import csv
from services.digital_twin import digital_twin
import logging

logger = logging.getLogger(__name__)

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'simulation', 'datasets')

class DatasetLoader:
    @staticmethod
    def list_available_datasets():
        datasets = []
        if os.path.exists(DATASETS_DIR):
            for filename in os.listdir(DATASETS_DIR):
                if filename.endswith(('.json', '.csv')):
                    filepath = os.path.join(DATASETS_DIR, filename)
                    datasets.append({
                        "name": filename,
                        "path": filepath,
                        "size_bytes": os.path.getsize(filepath)
                    })
        return datasets

    @staticmethod
    def load_dataset_file(filename: str):
        filepath = os.path.join(DATASETS_DIR, filename)
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Dataset {filename} not found in {DATASETS_DIR}")
        
        records = []
        if filename.endswith('.json'):
            with open(filepath, 'r') as f:
                records = json.load(f)
        elif filename.endswith('.csv'):
            with open(filepath, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # parse types
                    rec = {
                        "timestamp": row.get("timestamp"),
                        "battery_soc": float(row.get("battery_soc", 90.0)),
                        "battery_temp": float(row.get("battery_temp", 20.0)),
                        "solar_power_w": float(row.get("solar_power_w", 150)),
                        "storage_used_gb": float(row.get("storage_used_gb", 10.0)),
                        "pointing_mode": row.get("pointing_mode", "EARTH_TRACK"),
                        "comm_window": row.get("comm_window", "true").lower() == "true",
                    }
                    if "pos_x" in row and "pos_y" in row and "pos_z" in row:
                        rec["position_km"] = [float(row["pos_x"]), float(row["pos_y"]), float(row["pos_z"])]
                    if "vel_x" in row and "vel_y" in row and "vel_z" in row:
                        rec["velocity_kms"] = [float(row["vel_x"]), float(row["vel_y"]), float(row["vel_z"])]
                    records.append(rec)
        
        digital_twin.load_dataset(records, filename)
        logger.info(f"Loaded dataset '{filename}' with {len(records)} records.")
        return len(records)

    @staticmethod
    def stop_dataset():
        digital_twin.stop_dataset()
        logger.info("Dataset playback stopped. Reverted to dynamic physics simulation.")
