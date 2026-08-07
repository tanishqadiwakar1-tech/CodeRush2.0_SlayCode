import React, { useState } from 'react';
import useMissionStore from '../store/useMissionStore';
import SectionHeader from '../components/ui/SectionHeader';
import GlassPanel from '../components/ui/GlassPanel';
import TelemetryChart from '../components/ui/TelemetryChart';
import StatusPill from '../components/ui/StatusPill';
import { Activity, Zap, Thermometer, Radio, Cpu, Compass } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Telemetry Streams', icon: Activity },
  { id: 'power', label: 'Power & Voltage', icon: Zap },
  { id: 'thermal', label: 'Thermal Subsystem', icon: Thermometer },
  { id: 'comms', label: 'Communications & RF', icon: Radio },
  { id: 'payload', label: 'Payload & Data Storage', icon: Cpu },
];

const CHART_CONFIGS = {
  battery_temp: {
    key: 'battery_temp',
    label: 'Battery Temperature Thermal Gradient',
    unit: '°C',
    color: '#EF4444',
    gradientId: 'gradTempRedesigned',
    warnLine: 35,
    critLine: 45,
    category: 'thermal',
  },
  battery_soc: {
    key: 'battery_soc',
    label: 'Battery State of Charge Reserve',
    unit: '%',
    color: '#22C55E',
    gradientId: 'gradSocRedesigned',
    warnLine: 30,
    category: 'power',
  },
  bus_voltage: {
    key: 'bus_voltage',
    label: 'Primary Power Bus Voltage',
    unit: 'V',
    color: '#A78BFA',
    gradientId: 'gradVoltRedesigned',
    warnLine: 25,
    category: 'power',
  },
  storage_used_gb: {
    key: 'storage_used_gb',
    label: 'Solid State Storage Buffer',
    unit: 'GB',
    color: '#38BDF8',
    gradientId: 'gradStorageRedesigned',
    warnLine: 14,
    category: 'payload',
  },
};

export default function Telemetry() {
  const telemetry = useMissionStore((s) => s.telemetry);
  const latest = useMissionStore((s) => s.latestTelemetry);
  const [activeTab, setActiveTab] = useState('all');

  const filteredConfigs = Object.values(CHART_CONFIGS).filter(
    (cfg) => activeTab === 'all' || cfg.category === activeTab
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Live Mission Telemetry Console"
        subtitle="Synchronized real-time spacecraft subsystem metric feeds and limit checking"
        icon={Activity}
      />

      {/* Telemetry Control Bar / Subsystem Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Charts & Subsystem Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Synchronized Recharts Area (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {filteredConfigs.map((config) => (
            <TelemetryChart key={config.key} data={telemetry} config={config} />
          ))}
        </div>

        {/* Subsystem Real-Time Status Breakdown (1 Col) */}
        <GlassPanel title="Subsystem Health & Limits">
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Power Subsystem (EPS)</span>
                <StatusPill color="green" label="NOMINAL" />
              </div>
              <p className="text-[11px] text-slate-500">
                Solar Generation: {latest?.solar_generation_w?.toFixed(0) ?? 150}W
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Thermal Subsystem (TCS)</span>
                <StatusPill
                  color={(latest?.battery_temp ?? 20) > 35 ? 'red' : 'green'}
                  label={(latest?.battery_temp ?? 20) > 35 ? 'EXCURSION' : 'NOMINAL'}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Battery Temp: {latest?.battery_temp?.toFixed(1) ?? 20}°C (Max 45°C)
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Communications (RF)</span>
                <StatusPill
                  color={latest?.antenna_visible ? 'green' : 'yellow'}
                  label={latest?.antenna_visible ? 'LINK ACTIVE' : 'OCCLUDED'}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Antenna Mode: {latest?.antenna_visible ? 'DSN Goldstone Pass' : 'Standby'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Attitude Control (ADCS)</span>
                <StatusPill color="cyan" label={latest?.pointing_mode || 'EARTH_TRACK'} />
              </div>
              <p className="text-[11px] text-slate-500">
                Pointing Accuracy: 0.02° nominal
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
