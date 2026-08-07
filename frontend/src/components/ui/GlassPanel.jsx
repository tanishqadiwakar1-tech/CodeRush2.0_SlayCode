import React from 'react';
import { motion } from 'framer-motion';

export default function GlassPanel({ title, action, children, className = '', glow = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`glass-card p-6 ${glow ? 'panel-glow' : ''} ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
            {title}
          </h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
