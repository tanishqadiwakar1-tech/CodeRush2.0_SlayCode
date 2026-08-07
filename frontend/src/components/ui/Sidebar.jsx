import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Globe, LayoutDashboard, Calendar, Clock, Gauge, AlertTriangle,
  FileText, CheckCircle2, RotateCcw, BarChart3, Sliders
} from 'lucide-react';

const navSections = [
  {
    title: 'MISSION',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/planner', icon: Calendar, label: 'Planner' },
      { to: '/timeline', icon: Clock, label: 'Timeline' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { to: '/telemetry', icon: Gauge, label: 'Telemetry' },
      { to: '/anomalies', icon: AlertTriangle, label: 'Anomalies' },
      { to: '/procedures', icon: FileText, label: 'Procedures' },
      { to: '/approvals', icon: CheckCircle2, label: 'Approvals' },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { to: '/replay', icon: RotateCcw, label: 'Replay' },
      { to: '/reports', icon: BarChart3, label: 'Reports' },
      { to: '/simulation', icon: Sliders, label: 'Simulation' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-[260px] flex-shrink-0 bg-[#070d1e] border-r border-[#162646] rounded-r-2xl flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-20 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header Icon & Title */}
        <div className="flex items-center gap-2.5 px-3 pt-2 text-slate-300">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase">
            MISSION
          </span>
        </div>

        {/* Navigation Sections */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                  {({ isActive }) => (
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0e2a42] text-[#00f0ff] border border-[#00f0ff]/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'text-slate-400 hover:bg-[#0f1b36] hover:text-slate-200'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-[#00f0ff]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
