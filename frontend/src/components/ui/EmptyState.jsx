import React from 'react';
import { Search } from 'lucide-react';

export default function EmptyState({ icon: Icon = Search, title = 'No Data Available', description = 'There are no records matching your request.' }) {
  return (
    <div className="py-12 px-6 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 flex flex-col items-center justify-center">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-sm font-semibold text-slate-300 font-display">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
    </div>
  );
}
