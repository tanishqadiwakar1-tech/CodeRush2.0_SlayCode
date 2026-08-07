import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';

export default function TelemetryChart({ data = [], config }) {
  const { key, label, unit, color, gradientId, warnLine, critLine } = config;

  const latestVal = data.length > 0 ? data[data.length - 1]?.[key] : 0;

  return (
    <div className="glass-card glass-card-hover p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-mono font-semibold">
          {label}
        </span>
        <span className="text-xl font-bold font-mono" style={{ color }}>
          {typeof latestVal === 'number' ? latestVal.toFixed(1) : latestVal} {unit}
        </span>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2A44" opacity={0.6} />
            <XAxis
              dataKey="mission_time"
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={(t) => `T+${t}s`}
            />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B1020',
                borderColor: '#1E2A44',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#F8FAFC',
              }}
              labelFormatter={(t) => `MET T+${t}s`}
            />
            {warnLine && (
              <ReferenceLine y={warnLine} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'WARN', fill: '#F59E0B', fontSize: 10 }} />
            )}
            {critLine && (
              <ReferenceLine y={critLine} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'CRIT', fill: '#EF4444', fontSize: 10 }} />
            )}
            <Area
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
