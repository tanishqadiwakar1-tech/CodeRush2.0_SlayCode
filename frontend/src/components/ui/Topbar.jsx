import React from 'react';

export default function Topbar() {
  return (
    <header className="h-16 px-6 bg-[#060913] border-b border-[#162646] flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: STELLAR Logo & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* 4-pointed sparkle star logo */}
          <svg className="w-6 h-6 text-cyan-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <span className="font-display font-extrabold text-xl tracking-wider text-white">
            STELLAR
          </span>
        </div>
        <div className="h-4 w-px bg-[#162646]" />
        <span className="text-xs font-sans text-slate-400 font-medium">
          Mission Antigravity
        </span>
      </div>

      {/* Center: Safety Banner */}
      <div className="hidden lg:flex items-center">
        <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
          SIMULATION-ONLY ENVIRONMENT — NO LIVE SPACECRAFT CONNECTION
        </span>
      </div>

      {/* Right: Operational Pill Badges */}
      <div className="flex items-center gap-2.5">
        <span className="px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
          COMM
        </span>
        <span className="px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
          POWER
        </span>
        <span className="px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
          THERMAL
        </span>
        <span className="px-4 py-1 rounded-full bg-cyan-500 text-slate-950 text-xs font-mono font-extrabold tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          ALL NOMINAL
        </span>
      </div>
    </header>
  );
}
