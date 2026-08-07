import React, { useEffect, useState } from 'react';
import useMissionStore from '../store/useMissionStore';
import SectionHeader from '../components/ui/SectionHeader';
import GlassPanel from '../components/ui/GlassPanel';
import AnomalyCard from '../components/ui/AnomalyCard';
import EmptyState from '../components/ui/EmptyState';
import { fetchApi } from '../services/api';
import { AlertTriangle, ShieldAlert, FileText, CheckCircle2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Anomalies() {
  const anomalies = useMissionStore((s) => s.anomalies);
  const setAnomalies = useMissionStore((s) => s.setAnomalies);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi('/api/anomalies/').then((res) => {
      if (res.success) {
        setAnomalies(res.data);
        if (res.data.length > 0) setSelectedAnomaly(res.data[0]);
      }
    });
  }, []);

  const activeAnomalies = anomalies.filter((a) => !a.resolved);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Anomaly Detection & Automated Diagnosis Engine"
        subtitle="Real-time threshold monitoring, alarm correlation, and confidence hypothesis ranking"
        icon={AlertTriangle}
      />

      {/* Grid: Anomaly List (1 Col) + Detailed Diagnosis View (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomaly Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>Detected Fault Scenarios</span>
            <span className="text-rose-400 font-bold">{activeAnomalies.length} Active</span>
          </div>

          {anomalies.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title="No Anomalies Detected"
              description="All telemetry feeds are within nominal operating limits."
            />
          ) : (
            anomalies.map((anom) => (
              <AnomalyCard
                key={anom.anomaly_id}
                anomaly={anom}
                onSelect={(a) => setSelectedAnomaly(a)}
                isSelected={selectedAnomaly?.anomaly_id === anom.anomaly_id}
              />
            ))
          )}
        </div>

        {/* Deep Diagnosis & Recommended Procedure Panel (2 Cols) */}
        <div className="lg:col-span-2">
          {selectedAnomaly ? (
            <GlassPanel title={`Diagnostic Analysis: ${selectedAnomaly.anomaly_id}`} glow>
              <div className="space-y-6">
                {/* Fault Summary */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-display">
                      {selectedAnomaly.anomaly_id} — {selectedAnomaly.severity} Severity Excursion
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-mono">
                      Detected at: {new Date(selectedAnomaly.detected_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Evidence List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Correlated Telemetry Evidence
                  </h4>
                  <div className="space-y-2">
                    {selectedAnomaly.evidence?.map((ev, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-200 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hypotheses Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Diagnostic Hypotheses Confidence Breakdown
                  </h4>
                  <div className="space-y-3">
                    {selectedAnomaly.hypotheses?.map((h, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="font-bold text-slate-200">{h.name.replace(/_/g, ' ')}</span>
                          <span className="text-cyan-400 font-bold">{(h.confidence * 100).toFixed(0)}% Confidence</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            style={{ width: `${h.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Procedure CTA */}
                {selectedAnomaly.recommended_procedure && (
                  <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                        Recommended Recovery Procedure:
                      </span>
                      <h4 className="text-base font-bold font-mono text-slate-100 mt-0.5">
                        {selectedAnomaly.recommended_procedure}
                      </h4>
                    </div>
                    <button
                      onClick={() => navigate('/procedures')}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    >
                      View & Execute Runbook
                    </button>
                  </div>
                )}
              </div>
            </GlassPanel>
          ) : (
            <EmptyState title="Select Anomaly" description="Click any anomaly on the left to view detailed diagnosis." />
          )}
        </div>
      </div>
    </div>
  );
}
