import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassPanel from '../components/ui/GlassPanel';
import StatusPill from '../components/ui/StatusPill';
import { fetchApi } from '../services/api';
import { Cpu, Zap, AlertTriangle, Play, ShieldAlert } from 'lucide-react';

export default function Simulation() {
  const [catalog, setCatalog] = useState({});
  const [activeFaults, setActiveFaults] = useState({});
  const [loading, setLoading] = useState(false);

  const loadCatalog = () => {
    fetchApi('/api/faults/catalog').then((res) => res.success && setCatalog(res.data));
    fetchApi('/api/faults/active').then((res) => res.success && setActiveFaults(res.data));
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleInject = async (faultType) => {
    setLoading(true);
    const res = await fetchApi('/api/faults/inject', {
      method: 'POST',
      body: JSON.stringify({ fault_type: faultType }),
    });
    setLoading(false);
    if (res.success) {
      alert(`Fault '${faultType}' injected into digital twin simulation.`);
      loadCatalog();
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Simulation Sandbox & Fault Injection Console"
        subtitle="Manually trigger anomaly scenarios to test automated diagnosis and recovery runbooks"
        icon={Cpu}
      />

      {/* Fault Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(catalog).map(([key, item]) => {
          const isActive = activeFaults[key];
          return (
            <GlassPanel key={key} title={key.replace(/_/g, ' ')} className="flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <StatusPill color={item.severity === 'HIGH' ? 'red' : 'yellow'} label={item.severity} />
                  {isActive && <StatusPill color="red" label="ACTIVE FAULT" pulse />}
                </div>
                <p className="text-xs text-slate-300 font-mono">{item.description}</p>
              </div>

              <button
                onClick={() => handleInject(key)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold hover:bg-rose-500/25 transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)] disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                Inject Fault into Digital Twin
              </button>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
