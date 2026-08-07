"""
Tests for Space Mission Operations Automator backend.
"""
import pytest
import json
import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models import db


@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()


class TestHealthEndpoint:
    def test_health(self, client):
        response = client.get('/health')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['status'] == 'healthy'
        assert 'SIMULATION' in data['mode']


class TestTelemetryAPI:
    def test_live_telemetry(self, client):
        response = client.get('/api/telemetry/live')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True

    def test_telemetry_history(self, client):
        response = client.get('/api/telemetry/history')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True
        assert isinstance(data['data'], list)


class TestPlannerAPI:
    def test_timeline(self, client):
        response = client.get('/api/planner/timeline')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True

    def test_plan_generation(self, client):
        response = client.post('/api/planner/plan',
            data=json.dumps({"goals": ["OBSERVE_TARGET_A"]}),
            content_type='application/json')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True


class TestFaultsAPI:
    def test_inject_fault(self, client):
        response = client.post('/api/faults/inject',
            data=json.dumps({"fault_type": "battery_thermal_runaway"}),
            content_type='application/json')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True

    def test_inject_unknown_fault(self, client):
        response = client.post('/api/faults/inject',
            data=json.dumps({"fault_type": "unknown_fault"}),
            content_type='application/json')
        assert response.status_code == 400

    def test_fault_catalog(self, client):
        response = client.get('/api/faults/catalog')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert 'battery_thermal_runaway' in data['data']


class TestAnomaliesAPI:
    def test_get_anomalies(self, client):
        response = client.get('/api/anomalies/')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True

    def test_get_active_anomalies(self, client):
        response = client.get('/api/anomalies/active')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True


class TestProceduresAPI:
    def test_list_procedures(self, client):
        response = client.get('/api/procedures/')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True


class TestApprovalsAPI:
    def test_get_pending(self, client):
        response = client.get('/api/approvals/pending')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True

    def test_approve_nonexistent(self, client):
        response = client.post('/api/approvals/CMD-FAKE',
            data=json.dumps({"approved": True, "operator": "test", "comment": "test"}),
            content_type='application/json')
        assert response.status_code == 404


class TestReplayAPI:
    def test_get_events(self, client):
        response = client.get('/api/replay/events')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True
        assert isinstance(data['data'], list)

    def test_get_nonexistent_event(self, client):
        response = client.get('/api/replay/ANOM-999')
        assert response.status_code == 404


class TestMetricsAPI:
    def test_metrics(self, client):
        response = client.get('/api/metrics/')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['success'] is True
        assert 'schedule_feasibility' in data['data']
        assert 'anomaly_precision' in data['data']


class TestDigitalTwin:
    def test_state_update(self):
        from services.digital_twin import DigitalTwinState
        twin = DigitalTwinState()
        initial = twin.get_state()
        twin.update()
        updated = twin.get_state()
        assert updated['mission_time'] == initial['mission_time'] + 1

    def test_fault_injection(self):
        from services.digital_twin import DigitalTwinState
        twin = DigitalTwinState()
        assert twin.inject_fault('battery_thermal_runaway') is True
        assert twin.faults['battery_thermal_runaway'] is True

    def test_fault_mitigation(self):
        from services.digital_twin import DigitalTwinState
        twin = DigitalTwinState()
        twin.inject_fault('battery_thermal_runaway')
        assert twin.mitigate_fault('battery_thermal_runaway') is True
        assert twin.faults['battery_thermal_runaway'] is False

    def test_battery_temp_rises_with_fault(self):
        from services.digital_twin import DigitalTwinState
        twin = DigitalTwinState()
        initial_temp = twin.get_state()['battery_temp']
        twin.inject_fault('battery_thermal_runaway')
        for _ in range(10):
            twin.update()
        assert twin.get_state()['battery_temp'] > initial_temp
