import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassPanel from '../components/ui/GlassPanel';
import ProcedureStepper from '../components/ui/ProcedureStepper';
import EmptyState from '../components/ui/EmptyState';
import { fetchApi } from '../services/api';
import { FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Procedures() {
  const [procedures, setProcedures] = useState([]);
  const [selectedProc, setSelectedProc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi('/api/procedures/').then((res) => {
      if (res.success) {
        setProcedures(res.data);
        if (res.data.length > 0) setSelectedProc(res.data[0]);
      }
    });
  }, []);

  const handlePropose = async (procId) => {
    const res = await fetchApi('/api/procedures/propose', {
      method: 'POST',
      body: JSON.stringify({ procedure_id: procId }),
    });
    if (res.success) {
      alert(`Procedure proposed! Command ID: ${res.data.command_id}\nRedirecting to Approvals Gateway.`);
      navigate('/approvals');
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Versioned Operational Runbooks"
        subtitle="Pre-validated emergency procedure runbooks with command impact previews"
        icon={FileText}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Procedure Runbook Selector List */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Available Runbooks ({procedures.length})
          </span>

          {procedures.map((proc) => {
            const isSelected = selectedProc?.id === proc.id;
            return (
              <div
                key={proc.id}
                onClick={() => setSelectedProc(proc)}
                className={`glass-card p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-100">{proc.id}</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">v{proc.version}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 mt-1 font-display">{proc.title}</h4>
                <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-400">
                  <span>{proc.steps?.length || 0} Execution Steps</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Procedure Stepper (2 Cols) */}
        <div className="lg:col-span-2">
          {selectedProc ? (
            <GlassPanel glow>
              <ProcedureStepper procedure={selectedProc} onPropose={handlePropose} />
            </GlassPanel>
          ) : (
            <EmptyState title="Select Runbook" description="Choose a procedure runbook from the left panel." />
          )}
        </div>
      </div>
    </div>
  );
}
