import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, FastForward, AlertTriangle, ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import StatusPill from './StatusPill';

const EVENT_ICONS = {
  ANOMALY: AlertTriangle,
  APPROVAL: ShieldCheck,
  ACTIVITY: Activity,
};

const EVENT_STYLES = {
  ANOMALY: { color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
  APPROVAL: { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  ACTIVITY: { color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
};

export default function ReplayTimeline({ events = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="space-y-6">
      {/* Playback Control Bar */}
      <div className="glass-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setCurrentIndex(0)}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-800" />

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                  speed === s ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Sync Progress Slider */}
        <div className="flex-1 max-w-md space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Replay Timeline Progress</span>
            <span>{events.length > 0 ? `${currentIndex + 1} / ${events.length}` : '0 / 0'}</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, events.length - 1)}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((ev, idx) => {
          const Icon = EVENT_ICONS[ev.type] || Activity;
          const style = EVENT_STYLES[ev.type] || EVENT_STYLES.ACTIVITY;
          const isCurrent = idx === currentIndex;

          return (
            <motion.div
              key={ev.event_id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              onClick={() => {
                setCurrentIndex(idx);
                setSelectedEvent(ev);
              }}
              className="relative cursor-pointer"
            >
              {/* Event Marker Node */}
              <div
                className={`absolute -left-6 top-3 w-4 h-4 rounded-full border-2 bg-[#060816] transition-all ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_12px_#38bdf8] scale-125'
                    : 'border-slate-700'
                }`}
              />

              <div
                className={`glass-card p-4 transition-all ${
                  isCurrent ? 'border-cyan-500/50 bg-cyan-500/10' : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${style.bg} ${style.border} ${style.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-slate-100">{ev.summary}</h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '—'}
                      </span>
                    </div>
                  </div>

                  <StatusPill color={ev.type === 'ANOMALY' ? 'red' : ev.type === 'APPROVAL' ? 'green' : 'cyan'} label={ev.type} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Outcome Comparison Matrix */}
      {events.some((e) => e.type === 'APPROVAL') && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Automated vs Operator Outcome Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase">
                  <th className="py-3 px-4">Automated Recommendation</th>
                  <th className="py-3 px-4">Operator Decision</th>
                  <th className="py-3 px-4">Simulated Spacecraft Outcome</th>
                </tr>
              </thead>
              <tbody>
                {events
                  .filter((e) => e.type === 'APPROVAL')
                  .map((e, idx) => (
                    <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                      <td className="py-3 px-4 text-cyan-300 font-semibold">{e.details?.procedure_id || 'PROC-BATT-THERMAL-01'}</td>
                      <td className="py-3 px-4">
                        <StatusPill
                          color={e.details?.status === 'EXECUTED' ? 'green' : 'red'}
                          label={e.details?.status || 'PENDING'}
                        />
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {e.details?.status === 'EXECUTED'
                          ? 'Mitigation executed successfully. Thermal gradient stabilized.'
                          : 'Awaiting operator approval.'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
