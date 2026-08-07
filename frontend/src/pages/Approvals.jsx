import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassPanel from '../components/ui/GlassPanel';
import ApprovalCard from '../components/ui/ApprovalCard';
import EmptyState from '../components/ui/EmptyState';
import { fetchApi } from '../services/api';
import { ShieldCheck, Clock, ShieldAlert } from 'lucide-react';

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);

  const loadApprovals = async () => {
    const res = await fetchApi('/api/approvals/all');
    if (res.success) setApprovals(res.data);
  };

  useEffect(() => {
    loadApprovals();
    const interval = setInterval(loadApprovals, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApproval = async (commandId, approved, operator, comment) => {
    await fetchApi(`/api/approvals/${commandId}`, {
      method: 'POST',
      body: JSON.stringify({ approved, operator, comment }),
    });
    loadApprovals();
  };

  const handleReview = (commandId, operator, comment) => {
    alert(`Review requested for ${commandId} by ${operator}. Notification sent to Lead Controller.`);
  };

  const pendingList = approvals.filter((a) => a.status === 'PENDING_APPROVAL');
  const resolvedList = approvals.filter((a) => a.status !== 'PENDING_APPROVAL');

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Command Approval Authorization Center"
        subtitle="Mandatory human-in-the-loop authority gate for simulated spacecraft commands"
        icon={ShieldCheck}
      />

      {/* Pending Authorization Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-slate-400">
          <span className="flex items-center gap-2 font-bold text-amber-400">
            <Clock className="w-4 h-4" />
            Commands Awaiting Operator Authorization ({pendingList.length})
          </span>
        </div>

        {pendingList.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No Pending Commands"
            description="All proposed recovery commands have been authorized or rejected."
          />
        ) : (
          pendingList.map((app) => (
            <ApprovalCard
              key={app.command_id}
              approval={app}
              onApprove={(id, apprv, op, c) => handleApproval(id, true, op, c)}
              onReject={(id, apprv, op, c) => handleApproval(id, false, op, c)}
              onRequestReview={(id, op, c) => handleReview(id, op, c)}
            />
          ))
        )}
      </div>

      {/* Resolved Audit History */}
      {resolvedList.length > 0 && (
        <GlassPanel title="Authorization Audit Log">
          <div className="space-y-3">
            {resolvedList.map((app) => (
              <ApprovalCard key={app.command_id} approval={app} />
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
