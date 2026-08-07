import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, MessageSquare, AlertCircle, Check, X, HelpCircle } from 'lucide-react';
import StatusPill from './StatusPill';

export default function ApprovalCard({ approval, onApprove, onReject, onRequestReview }) {
  const [comment, setComment] = useState('');
  const [operator, setOperator] = useState('flight-controller-1');

  const statusColors = {
    PENDING_APPROVAL: 'yellow',
    APPROVED: 'cyan',
    EXECUTED: 'green',
    REJECTED: 'red',
  };

  const isPending = approval.status === 'PENDING_APPROVAL';

  const handleAction = (type) => {
    if (!comment.trim() && isPending) {
      alert('Operator comment is mandatory before submitting authorization.');
      return;
    }
    if (type === 'approve' && onApprove) onApprove(approval.command_id, true, operator, comment);
    if (type === 'reject' && onReject) onReject(approval.command_id, false, operator, comment);
    if (type === 'review' && onRequestReview) onRequestReview(approval.command_id, operator, comment);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 relative overflow-hidden ${
        isPending ? 'border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-sm font-bold">
            {approval.command_id}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 font-display">
              {approval.procedure_id} Execution
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Created: {new Date(approval.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <StatusPill
          color={statusColors[approval.status] || 'slate'}
          label={approval.status}
          pulse={isPending}
        />
      </div>

      {/* Expected System Effects Breakdown */}
      <div className="mb-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
          Simulated Impact & Expected Subsystem Effects:
        </span>
        <ul className="space-y-1.5 text-xs text-slate-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Payload power consumption reduced by 40W
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Battery thermal dissipation efficiency increased by 35%
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Science downlink buffer preserved in safe storage
          </li>
        </ul>
      </div>

      {/* Interactive Form for Pending Approval */}
      {isPending ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1 block">
                Authorized Operator:
              </label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1 block">
                Mandatory Comment:
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Thermal margins reviewed; proceed with execution."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Authorization Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleAction('review')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold hover:bg-amber-500/20 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Request Review
            </button>
            <button
              onClick={() => handleAction('reject')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold hover:bg-rose-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
              Reject Command
            </button>
            <button
              onClick={() => handleAction('approve')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              <Check className="w-4 h-4 text-cyan-400" />
              Approve & Execute
            </button>
          </div>
        </div>
      ) : (
        /* Resolved Audit Info */
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Operator: {approval.operator || 'anonymous'}</span>
          <span>Comment: "{approval.comment || 'None'}"</span>
        </div>
      )}
    </motion.div>
  );
}
