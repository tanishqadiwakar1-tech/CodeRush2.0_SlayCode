import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import StatusPill from './StatusPill';

export function ConfidenceBar({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-slate-300 font-medium">{label.replace(/_/g, ' ')}</span>
        <span className="font-mono text-cyan-400 font-bold">{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_#38bdf8]"
        />
      </div>
    </div>
  );
}

export default function AnomalyCard({ anomaly, onSelect, isSelected = false }) {
  const severityMap = {
    CRITICAL: 'red',
    HIGH: 'red',
    MEDIUM: 'yellow',
    LOW: 'cyan',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => onSelect && onSelect(anomaly)}
      className={`glass-card p-5 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_30px_rgba(56,189,248,0.2)]'
          : 'hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-mono text-slate-100">{anomaly.anomaly_id}</h4>
            <span className="text-[10px] font-mono text-slate-400">
              {new Date(anomaly.detected_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <StatusPill
          color={severityMap[anomaly.severity] || 'red'}
          label={anomaly.severity}
          pulse={anomaly.severity === 'CRITICAL' || anomaly.severity === 'HIGH'}
        />
      </div>

      {/* Evidence List */}
      <div className="mb-4 space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Evidence:</span>
        {anomaly.evidence?.slice(0, 2).map((ev, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />
            <span>{ev}</span>
          </div>
        ))}
      </div>

      {/* Hypotheses ranking */}
      {anomaly.hypotheses && (
        <div className="space-y-2 pt-3 border-t border-slate-800/80">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Ranked Hypotheses:</span>
          {anomaly.hypotheses.map((h, idx) => (
            <ConfidenceBar key={idx} label={h.name} value={Math.round(h.confidence * 100)} />
          ))}
        </div>
      )}

      {/* Recommended Runbook CTA */}
      {anomaly.recommended_procedure && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-300">
            Runbook: <strong className="font-bold">{anomaly.recommended_procedure}</strong>
          </span>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </div>
      )}
    </motion.div>
  );
}
