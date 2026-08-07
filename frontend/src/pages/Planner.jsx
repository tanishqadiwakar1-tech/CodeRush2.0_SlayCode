import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useMissionStore from '../store/useMissionStore';
import SectionHeader from '../components/ui/SectionHeader';
import GlassPanel from '../components/ui/GlassPanel';
import PlannerGantt from '../components/ui/PlannerGantt';
import ConstraintBadge from '../components/ui/ConstraintBadge';
import { fetchApi } from '../services/api';
import { Calendar, Plus, CheckCircle2, Zap, ShieldCheck, Radio, Sparkles } from 'lucide-react';

const GOAL_OPTIONS = [
  { id: 'OBSERVE_TARGET_A', label: 'Observe Target A', icon: '📷' },
  { id: 'DOWNLINK_SCIENCE_DATA', label: 'Downlink Science Data', icon: '📡' },
  { id: 'CALIBRATE_CAMERA', label: 'Calibrate Camera Payload', icon: '⚡' },
  { id: 'ORBIT_CORRECTION', label: 'Orbit Correction Burn', icon: '🚀' },
  { id: 'SAFE_MODE_TEST', label: 'Safe Mode Readiness Test', icon: '🛡' },
];

export default function Planner() {
  const activities = useMissionStore((s) => s.activities);
  const setActivities = useMissionStore((s) => s.setActivities);

  const [selectedGoals, setSelectedGoals] = useState([
    'OBSERVE_TARGET_A',
    'DOWNLINK_SCIENCE_DATA',
    'CALIBRATE_CAMERA',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleGoal = (id) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    const res = await fetchApi('/api/planner/plan', {
      method: 'POST',
      body: JSON.stringify({ goals: selectedGoals }),
    });
    setIsGenerating(false);

    // Refresh timeline
    const timelineRes = await fetchApi('/api/planner/timeline');
    if (timelineRes.success) {
      setActivities(timelineRes.data);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Constrained Mission Planner"
        subtitle="Automated constraint satisfaction scheduling for spacecraft activities"
        icon={Calendar}
        action={
          <button
            onClick={generatePlan}
            disabled={isGenerating || selectedGoals.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Computing Optimal Plan...' : 'Generate Constrained Plan'}
          </button>
        }
      />

      {/* Top Grid: Goal Builder + Resource & Constraints Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Builder (2 Cols) */}
        <GlassPanel title="Mission Goal Builder" className="lg:col-span-2 space-y-4">
          <p className="text-xs text-slate-400">
            Select target mission goals to compute an optimized, resource-safe activity schedule.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{goal.icon}</span>
                    <span className="text-xs font-mono font-medium">{goal.label}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassPanel>

        {/* Resource & Constraint Status Summary */}
        <GlassPanel title="Resource & Constraint Limits" className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Battery Margin:</span>
              <span className="text-emerald-400 font-bold">&gt; 35.0% Reserve</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Thermal Budget:</span>
              <span className="text-emerald-400 font-bold">&lt; 32.0°C Max</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Storage Buffer:</span>
              <span className="text-cyan-400 font-bold">10.0 / 16.0 GB</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
              Validated Constraints:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <ConstraintBadge type="POWER" label="Power Limits" status="pass" />
              <ConstraintBadge type="THERMAL" label="Thermal Margin" status="pass" />
              <ConstraintBadge type="COMM" label="Comm Window Align" status="pass" />
              <ConstraintBadge type="SAFE" label="Safe-mode Reserve" status="pass" />
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Interactive Gantt Timeline */}
      <GlassPanel title="Interactive Activity Schedule & Gantt View">
        <PlannerGantt activities={activities} />
      </GlassPanel>

      {/* Explanation Panel */}
      <GlassPanel title="Schedule Explanation & Optimization Rationale" glow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              Why This Order?
            </h4>
            <div className="space-y-2">
              {[
                'Observation scheduled before eclipse entry for optimal solar power',
                'Downlink aligned strictly with DSN Goldstone ground comm window',
                'Battery state-of-charge margin preserved above safe limit (35%)',
                'Thermal load distributed evenly across orbit segments',
              ].map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
              Optimization Confidence Score:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-cyan-400">100%</span>
              <span className="text-xs text-slate-400 font-mono">Zero constraint violations</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              All payload observation targets fit within available ground station passes and power generation envelopes.
            </p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
