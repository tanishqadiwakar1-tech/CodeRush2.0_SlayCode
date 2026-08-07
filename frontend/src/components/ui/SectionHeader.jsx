import React from 'react';

export default function SectionHeader({ title, subtitle, action, icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
