import React from 'react';
import { Info, Settings, TrendingUp } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend = '',
  status = 'Nominal',
  isThermal = false,
  sparkline = [20, 25, 30, 28, 35, 50, 42, 60, 55, 70],
}) {
  const minVal = Math.min(...sparkline);
  const maxVal = Math.max(...sparkline, 1);
  const range = maxVal - minVal || 1;

  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * 100;
      const y = 28 - ((val - minVal) / range) * 22;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="stellar-card p-4 flex flex-col justify-between relative min-h-[120px]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-cyan-400">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
            {title}
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-300">
          {title === 'BATTERY SOC' ? <Info className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-2xl font-bold font-display ${isThermal ? 'text-emerald-400' : 'text-white'}`}>
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400 font-semibold">{unit}</span>}
        {trend && (
          <span className="text-[11px] font-mono font-semibold text-emerald-400 ml-auto">
            {trend}
          </span>
        )}
      </div>

      {/* Sparkline & Status */}
      <div className="space-y-1 pt-1 border-t border-[#162646]/60">
        <div className="w-full h-7 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={isThermal ? '#22C55E' : '#00f0ff'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className={status === 'Nominal' || status === 'Good' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
            {status}
          </span>
          <TrendingUp className="w-3 h-3 text-emerald-400" />
        </div>
      </div>
    </div>
  );
}
