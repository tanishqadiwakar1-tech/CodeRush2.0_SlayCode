import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassPanel from '../components/ui/GlassPanel';
import ReplayTimeline from '../components/ui/ReplayTimeline';
import { fetchApi } from '../services/api';
import { History, RefreshCw } from 'lucide-react';

export default function Replay() {
  const [events, setEvents] = useState([]);

  const loadEvents = () => {
    fetchApi('/api/replay/events').then((res) => {
      if (res.success) setEvents(res.data);
    });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cinematic Event Replay & Decision Audit"
        subtitle="Immutable event log playback, operator action tracing, and simulated outcome verification"
        icon={History}
        action={
          <button
            onClick={loadEvents}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Event Audit Log
          </button>
        }
      />

      <GlassPanel glow>
        <ReplayTimeline events={events} />
      </GlassPanel>
    </div>
  );
}
