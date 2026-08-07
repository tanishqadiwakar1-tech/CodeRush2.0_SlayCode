import React from 'react';
import { ShieldCheck, Zap, Thermometer, Radio, HardDrive } from 'lucide-react';

export default function ConstraintBadge({ type, label, status = 'pass' }) {
  const icons = {
    POWER: Zap,
    THERMAL: Thermometer,
    COMM: Radio,
    STORAGE: HardDrive,
    SAFE: ShieldCheck,
  };
  const Icon = icons[type] || ShieldCheck;

  const statusStyles = {
    pass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    warn: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    fail: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium ${statusStyles[status] || statusStyles.pass}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{label || type}</span>
    </span>
  );
}
