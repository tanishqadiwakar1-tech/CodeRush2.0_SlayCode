import React from 'react';

export default function StatusPill({ color = 'green', label, pulse = false, icon: Icon }) {
  const colorMap = {
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dot-green shadow-[0_0_12px_rgba(34,197,94,0.2)]',
    yellow: 'bg-amber-500/15 text-amber-400 border-amber-500/30 dot-yellow shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    red: 'bg-rose-500/15 text-rose-400 border-rose-500/30 dot-red shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-pulse',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 dot-cyan shadow-[0_0_12px_rgba(56,189,248,0.2)]',
    slate: 'bg-slate-800/50 text-slate-400 border-slate-700/50',
  };

  const dotMap = {
    green: 'bg-emerald-400',
    yellow: 'bg-amber-400',
    red: 'bg-rose-400',
    cyan: 'bg-cyan-400',
    slate: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 ${colorMap[color] || colorMap.slate}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[color] || 'bg-slate-400'} ${pulse ? 'animate-ping' : ''}`} />
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </span>
  );
}
