import { create } from 'zustand';

const useMissionStore = create((set, get) => ({
  // ── Telemetry ──────────────────────────────────────────────────
  telemetry: [],
  latestTelemetry: null,

  addTelemetry: (packet) =>
    set((s) => ({
      telemetry: [...s.telemetry.slice(-199), packet],
      latestTelemetry: packet,
    })),

  // ── Anomalies ──────────────────────────────────────────────────
  anomalies: [],
  setAnomalies: (list) => set({ anomalies: list }),
  addAnomaly: (a) =>
    set((s) => ({ anomalies: [a, ...s.anomalies] })),

  // ── Approvals ──────────────────────────────────────────────────
  approvals: [],
  setApprovals: (list) => set({ approvals: list }),
  addApproval: (a) =>
    set((s) => ({ approvals: [a, ...s.approvals] })),

  // ── Timeline ──────────────────────────────────────────────────
  activities: [],
  setActivities: (list) => set({ activities: list }),

  // ── System messages ───────────────────────────────────────────
  systemMessages: [],
  addSystemMessage: (msg) =>
    set((s) => ({ systemMessages: [msg, ...s.systemMessages.slice(0, 49)] })),

  // ── Simulation clock ──────────────────────────────────────────
  missionTime: 0,
  setMissionTime: (t) => set({ missionTime: t }),

  // ── Alarms ────────────────────────────────────────────────────
  activeAlarms: 0,
  setActiveAlarms: (n) => set({ activeAlarms: n }),
}));

export default useMissionStore;
