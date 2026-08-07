import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { socket, fetchApi } from './services/api';
import useMissionStore from './store/useMissionStore';
import MissionControlLayout from './layouts/MissionControlLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Timeline from './pages/Timeline';
import Telemetry from './pages/Telemetry';
import Anomalies from './pages/Anomalies';
import Procedures from './pages/Procedures';
import Approvals from './pages/Approvals';
import Replay from './pages/Replay';
import Reports from './pages/Reports';
import Simulation from './pages/Simulation';

function SocketProvider({ children }) {
  const addTelemetry = useMissionStore((s) => s.addTelemetry);
  const setMissionTime = useMissionStore((s) => s.setMissionTime);
  const addAnomaly = useMissionStore((s) => s.addAnomaly);
  const addApproval = useMissionStore((s) => s.addApproval);
  const addSystemMessage = useMissionStore((s) => s.addSystemMessage);
  const setAnomalies = useMissionStore((s) => s.setAnomalies);
  const setActivities = useMissionStore((s) => s.setActivities);
  const setActiveAlarms = useMissionStore((s) => s.setActiveAlarms);

  useEffect(() => {
    socket.on('telemetry_update', (data) => {
      addTelemetry(data);
      if (data.mission_time !== undefined) setMissionTime(data.mission_time);
    });

    socket.on('telemetry:update', (data) => {
      addTelemetry(data);
      if (data.mission_time !== undefined) setMissionTime(data.mission_time);
    });

    socket.on('anomaly_alert', (data) => {
      addAnomaly(data);
      setActiveAlarms(useMissionStore.getState().anomalies.filter((a) => !a.resolved).length + 1);
    });

    socket.on('approval_pending', (data) => {
      addApproval(data);
    });

    socket.on('system_message', (data) => {
      addSystemMessage(data);
    });

    // Initial data fetch
    fetchApi('/api/anomalies/').then((res) => {
      if (res.success) {
        setAnomalies(res.data);
        setActiveAlarms(res.data.filter((a) => !a.resolved).length);
      }
    });

    fetchApi('/api/planner/timeline').then((res) => {
      if (res.success) setActivities(res.data);
    });

    return () => {
      socket.off('telemetry_update');
      socket.off('telemetry:update');
      socket.off('anomaly_alert');
      socket.off('approval_pending');
      socket.off('system_message');
    };
  }, []);

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route element={<MissionControlLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/telemetry" element={<Telemetry />} />
            <Route path="/anomalies" element={<Anomalies />} />
            <Route path="/procedures" element={<Procedures />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/replay" element={<Replay />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/simulation" element={<Simulation />} />
          </Route>
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}
