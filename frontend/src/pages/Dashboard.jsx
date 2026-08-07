import React, { useEffect, useState } from 'react';
import useMissionStore from '../store/useMissionStore';
import useTelemetry from '../hooks/useTelemetry';
import SpaceScene from '../components/three/SpaceScene';
import MetricCard from '../components/ui/MetricCard';
import {
  Battery, Thermometer, Zap, HardDrive, Sun, Radio, AlertCircle, Sparkles, MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function Dashboard() {
  const telemetry = useTelemetry();
  const latest = useMissionStore((s) => s.latestTelemetry) || telemetry;
  const anomalies = useMissionStore((s) => s.anomalies);
  const activities = useMissionStore((s) => s.activities);

  const [activeTab, setActiveTab] = useState('Power');

  // Chart data for Live Telemetry box
  const chartData = [
    { time: 'Lan', power: 80, thermal: 140 },
    { time: '2an', power: 170, thermal: 190 },
    { time: '4uc', timeLabel: 'Sep', power: 190, thermal: 150 },
    { time: 'Sep', power: 290, thermal: 280 },
    { time: 'Buc', power: 220, thermal: 210 },
    { time: '8oo', power: 190, thermal: 180 },
    { time: 'Man', power: 240, thermal: 250 },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold font-display text-white">Dashboard</h1>

      {/* ── TOP ROW: 3D Visualization & Health Metrics ─────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 3D Orbit Visualization Canvas Box (7 Cols) */}
        <div className="xl:col-span-7 relative stellar-panel p-1 overflow-hidden min-h-[380px] flex flex-col">
          {/* Corner Brackets */}
          <div className="corner-bracket corner-tl" />
          <div className="corner-bracket corner-tr" />
          <div className="corner-bracket corner-bl" />
          <div className="corner-bracket corner-br" />

          {/* 3D Three.js Scene */}
          <div className="w-full h-full min-h-[360px] rounded-xl overflow-hidden relative">
            <SpaceScene telemetry={latest} />

            {/* Floating HUD Chips */}
            <div className="absolute top-6 right-6 z-10 space-y-2 pointer-events-none">
              <div className="hud-chip-frame">
                Position Vector: <span className="highlight">-1.8, 3, -1.25</span>
              </div>
              <div className="hud-chip-frame">
                Velocity Vector: <span className="highlight">Earth-Facing</span>
              </div>
              <div className="hud-chip-frame">
                Comm Visibility: <span className="highlight">Active</span>
              </div>
              <div className="hud-chip-frame">
                Orbit Altitude: <span className="highlight">420 km</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 z-10 space-y-2 pointer-events-none">
              <div className="hud-chip-frame">
                Pointing Mode: <span className="highlight">Earth-Facing</span>
              </div>
              <div className="hud-chip-frame">
                Comm Visibility: <span className="highlight">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics Grid (5 Cols) */}
        <div className="xl:col-span-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Health Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
            <MetricCard
              title="BATTERY SOC"
              value={`${latest?.battery_soc?.toFixed(1) ?? 91.8}%`}
              icon={Battery}
              trend="+1.2%"
              status="Good"
              sparkline={[20, 25, 30, 28, 35, 50, 42, 60, 55, 70]}
            />
            <MetricCard
              title="THERMAL"
              value="Nominal"
              icon={Thermometer}
              status="Nominal"
              isThermal
              sparkline={[15, 18, 22, 20, 25, 30, 28, 35, 32, 40]}
            />
            <MetricCard
              title="BUS VOLTAGE"
              value={`${latest?.bus_voltage?.toFixed(1) ?? 28.1}V`}
              icon={Zap}
              status="Trend"
              sparkline={[24, 25, 27, 26, 28, 28.1, 28, 28.2]}
            />
            <MetricCard
              title="DATA STORAGE"
              value={`${latest?.storage_used_gb?.toFixed(0) ?? 65}%`}
              icon={HardDrive}
              status="Trend"
              sparkline={[40, 45, 50, 55, 60, 65]}
            />
            <MetricCard
              title="SOLAR POWER"
              value={`${latest?.solar_generation_w?.toFixed(0) ?? 180}W`}
              icon={Sun}
              status="Nominal"
              sparkline={[120, 140, 160, 175, 180]}
            />
            <MetricCard
              title="DOWNLINK RATE"
              value="10 Mbps"
              icon={Radio}
              status="Trend"
              sparkline={[2, 4, 6, 8, 10]}
            />
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW: Live Telemetry & Mission Timeline ───────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Live Telemetry (7 Cols) */}
        <div className="xl:col-span-7 stellar-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">Live Telemetry</h3>
            <button className="text-slate-500 hover:text-slate-300">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Subsystem Tabs */}
          <div className="flex gap-2">
            {['Power', 'Thermal', 'Comms', 'Payload', 'Attitude'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-[#122b44] text-[#00f0ff] border border-[#00f0ff]/50'
                    : 'bg-[#091224] text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dual Line Area Chart */}
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#162646" opacity={0.6} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 300]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1326',
                    borderColor: '#162646',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine x="Sep" stroke="#00f0ff" strokeDasharray="3 3" label={{ value: 'Synchronized crosshair tooltip', fill: '#00f0ff', fontSize: 10 }} />
                <Area type="monotone" dataKey="power" stroke="#00f0ff" strokeWidth={2.5} fill="url(#colorCyan)" />
                <Area type="monotone" dataKey="thermal" stroke="#ec4899" strokeWidth={2.5} fill="url(#colorPink)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mission Timeline (5 Cols) */}
        <div className="xl:col-span-5 stellar-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">Mission Timeline</h3>
            <button className="text-slate-500 hover:text-slate-300">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Scale Header */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 border-b border-[#162646] pb-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>

          {/* Timeline Rows */}
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span>Scheduled Event</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">Scheduled</span>
              </div>
              <div className="w-full h-3 rounded bg-[#091224] relative overflow-hidden">
                <div className="absolute left-[15%] w-[45%] h-full bg-cyan-400 rounded" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span>Scheduled Events</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">Scheduled Event</span>
              </div>
              <div className="w-full h-3 rounded bg-[#091224] relative overflow-hidden">
                <div className="absolute left-[35%] w-[50%] h-full bg-cyan-400 rounded" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span>Event Tracks</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">Timeline</span>
              </div>
              <div className="w-full h-3 rounded bg-[#091224] relative overflow-hidden">
                <div className="absolute left-[50%] w-[35%] h-full bg-cyan-400 rounded" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span>Scheduled Timeline</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Gantt</span>
              </div>
              <div className="w-full h-3 rounded bg-[#091224] relative overflow-hidden">
                <div className="absolute left-[80%] w-[20%] h-full bg-emerald-400 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Active Alerts / Recommendations ─────────── */}
      <div className="stellar-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-display text-white">Active Alerts / Recommendations</h3>
          </div>
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>

        {/* Row 1: Anomaly Alert */}
        <div className="p-4 rounded-xl bg-[#0e172a] border border-[#162646] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Anomaly: Unscheduled Reboot</span>
                <span className="text-xs text-rose-400 font-mono">Severity: High</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Detection time: Run 13, 2021 12:38:00
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Affected Subsystem</span>
              <div className="flex gap-1.5 mt-0.5">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Earth-Facing</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Comm Visibility</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400">Evidence Trackability: Active</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] mb-1">Confidence Bars</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-cyan-400 rounded" />
                <div className="w-4 h-2 bg-cyan-400 rounded" />
                <div className="w-4 h-2 bg-cyan-400 rounded" />
                <div className="w-4 h-2 bg-slate-700 rounded" />
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-mono font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              Recommended Procedure
            </button>
          </div>
        </div>

        {/* Row 2: Recommendation Alert */}
        <div className="p-4 rounded-xl bg-[#0e172a] border border-[#162646] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Recommendation: Adjust Solar Panel Angle</span>
              <span className="text-xs text-slate-400 font-mono block">Optimizes solar power generation for next orbit segment.</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px] mb-1">Confidence Bars</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-cyan-400 rounded" />
                <div className="w-4 h-2 bg-cyan-400 rounded" />
                <div className="w-4 h-2 bg-cyan-400 rounded" />
                <div className="w-4 h-2 bg-cyan-400 rounded" />
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold hover:bg-slate-700 transition-colors">
              Propose Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
