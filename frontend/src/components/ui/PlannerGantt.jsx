import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Zap, Radio, Camera, Cpu } from 'lucide-react';

const ACTIVITY_CONFIGS = {
  OBSERVE_TARGET_A: { color: 'bg-violet-500/80 border-violet-400', icon: Camera, label: 'Observation Target A' },
  COMPRESS_SCIENCE_DATA: { color: 'bg-blue-500/80 border-blue-400', icon: Cpu, label: 'Compress Science Data' },
  DOWNLINK_SCIENCE_DATA: { color: 'bg-cyan-500/80 border-cyan-400', icon: Radio, label: 'Downlink Science Data' },
  CALIBRATE_CAMERA: { color: 'bg-emerald-500/80 border-emerald-400', icon: Zap, label: 'Camera Calibration' },
};

export default function PlannerGantt({ activities = [] }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Time calculations
  const startTimes = activities.map((a) => new Date(a.start).getTime());
  const endTimes = activities.map((a) => new Date(a.end).getTime());
  const minTime = startTimes.length ? Math.min(...startTimes) : Date.now();
  const maxTime = endTimes.length ? Math.max(...endTimes) : Date.now() + 600000;
  const totalDuration = maxTime - minTime || 1;

  // Mock Communication windows overlays
  const commWindows = [
    { startOffset: 0.1, duration: 0.25, label: 'DSN Goldstone Window' },
    { startOffset: 0.6, duration: 0.2, label: 'DSN Madrid Window' },
  ];

  return (
    <div className="space-y-6">
      {/* Gantt Header & Window Legends */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Activity Types:</span>
          {Object.entries(ACTIVITY_CONFIGS).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-md border ${config.color}`} />
              <span className="text-xs text-slate-300 font-mono">{config.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-cyan-500/20 border border-cyan-500/40" />
          <span className="text-xs font-mono text-cyan-300">Ground Comm Window Active</span>
        </div>
      </div>

      {/* Gantt Chart Grid Canvas */}
      <div className="relative rounded-3xl border border-slate-800 bg-[#060816] p-6 overflow-hidden">
        {/* Background Comm Window Bands */}
        {commWindows.map((win, idx) => (
          <div
            key={idx}
            className="absolute top-0 bottom-0 bg-cyan-500/5 border-x border-cyan-500/20 pointer-events-none flex items-start justify-center pt-2"
            style={{
              left: `${win.startOffset * 100}%`,
              width: `${win.duration * 100}%`,
            }}
          >
            <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest px-2 py-0.5 rounded bg-slate-950/60">
              {win.label}
            </span>
          </div>
        ))}

        {/* Time Scale Ticks */}
        <div className="flex justify-between border-b border-slate-800 pb-3 mb-6 font-mono text-[10px] text-slate-500">
          <span>T+00:00</span>
          <span>T+02:00</span>
          <span>T+04:00</span>
          <span>T+06:00</span>
          <span>T+08:00</span>
          <span>T+10:00</span>
        </div>

        {/* Activity Tracks */}
        <div className="space-y-4 relative z-10">
          {activities.map((act, index) => {
            const start = new Date(act.start).getTime();
            const end = new Date(act.end).getTime();
            const leftPct = ((start - minTime) / totalDuration) * 100;
            const widthPct = Math.max(8, ((end - start) / totalDuration) * 100);
            const cfg = ACTIVITY_CONFIGS[act.activity] || {
              color: 'bg-slate-700 border-slate-600',
              icon: Clock,
              label: act.activity,
            };
            const Icon = cfg.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                onClick={() => setSelectedActivity(act)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200 font-display">
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(act.start).toLocaleTimeString()} – {new Date(act.end).toLocaleTimeString()}
                  </span>
                </div>

                {/* Track Bar */}
                <div className="h-10 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden flex items-center px-2">
                  <motion.div
                    whileHover={{ scaleY: 1.05 }}
                    className={`absolute h-7 rounded-lg border shadow-lg ${cfg.color} flex items-center px-3 gap-2 transition-all duration-300`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  >
                    <span className="text-xs font-mono font-bold text-white truncate">
                      {act.activity}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Activity Details Modal/Drawer */}
      {selectedActivity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-100 font-display">
                {selectedActivity.activity}
              </h4>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Reason: {selectedActivity.reason}
            </p>
          </div>
          <button
            onClick={() => setSelectedActivity(null)}
            className="text-xs font-mono text-slate-400 hover:text-white"
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}
