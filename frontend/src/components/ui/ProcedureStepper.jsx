import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, RotateCcw } from 'lucide-react';
import StatusPill from './StatusPill';

export default function ProcedureStepper({ procedure, onPropose }) {
  if (!procedure) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold font-display text-slate-100">{procedure.title}</h3>
            <StatusPill color="cyan" label={`v${procedure.version}`} />
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">{procedure.id} — {procedure.description}</p>
        </div>

        {onPropose && (
          <button
            onClick={() => onPropose(procedure.id)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold hover:bg-cyan-500/25 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            Propose Command for Approval
          </button>
        )}
      </div>

      {/* Preconditions */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
          Preconditions Verification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {procedure.preconditions?.map((cond, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-200">{cond}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Execution Flow */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
          Step-by-step Execution Flow
        </h4>

        <div className="space-y-3 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
          {procedure.steps?.map((step, idx) => (
            <motion.div
              key={step.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="relative pl-9"
            >
              <div className="absolute left-2 top-3 w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] font-mono flex items-center justify-center font-bold">
                {idx + 1}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-100 uppercase">{step.action}</span>
                  <span className="text-[10px] font-mono text-slate-500">Est. 30s execution</span>
                </div>
                <p className="text-xs text-slate-400">{step.description}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono text-emerald-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Expected Impact: {step.expected_effect}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rollback Strategy */}
      {procedure.rollback && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
            <RotateCcw className="w-4 h-4" />
            <span>Rollback Procedure Available</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {procedure.rollback.map((rb, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                {rb.action}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
