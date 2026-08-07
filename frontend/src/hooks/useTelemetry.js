import { useEffect } from 'react';
import { socket } from '../services/api';
import useMissionStore from '../store/useMissionStore';

export default function useTelemetry() {
  const latestTelemetry = useMissionStore((s) => s.latestTelemetry);
  const addTelemetry = useMissionStore((s) => s.addTelemetry);
  const setMissionTime = useMissionStore((s) => s.setMissionTime);

  useEffect(() => {
    const handleUpdate = (packet) => {
      addTelemetry(packet);
      if (packet.mission_time !== undefined) {
        setMissionTime(packet.mission_time);
      }
    };

    socket.on('telemetry_update', handleUpdate);
    socket.on('telemetry:update', handleUpdate);

    return () => {
      socket.off('telemetry_update', handleUpdate);
      socket.off('telemetry:update', handleUpdate);
    };
  }, [addTelemetry, setMissionTime]);

  return latestTelemetry;
}
