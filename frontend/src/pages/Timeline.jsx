import useMissionStore from '../store/useMissionStore';

const ACTIVITY_COLORS = {
  OBSERVE_TARGET_A: 'bg-violet-500',
  COMPRESS_SCIENCE_DATA: 'bg-blue-500',
  DOWNLINK_SCIENCE_DATA: 'bg-cyan-500',
  CALIBRATE_CAMERA: 'bg-emerald-500',
};

export default function Timeline() {
  const activities = useMissionStore((s) => s.activities);
  const missionTime = useMissionStore((s) => s.missionTime);

  // Calculate time range for the Gantt visualization
  const startTimes = activities.map((a) => new Date(a.start).getTime());
  const endTimes = activities.map((a) => new Date(a.end).getTime());
  const rangeStart = startTimes.length ? Math.min(...startTimes) : Date.now();
  const rangeEnd = endTimes.length ? Math.max(...endTimes) : Date.now() + 600000;
  const totalDuration = rangeEnd - rangeStart || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Mission Timeline</h2>
        <span className="text-xs text-gray-500 font-mono">
          {activities.length} activities scheduled
        </span>
      </div>

      <div className="glass-card p-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(ACTIVITY_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${color}`} />
              <span className="text-xs text-gray-400">{name.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>

        {/* Gantt-style bars */}
        <div className="space-y-3">
          {activities.map((a, i) => {
            const start = new Date(a.start).getTime();
            const end = new Date(a.end).getTime();
            const leftPct = ((start - rangeStart) / totalDuration) * 100;
            const widthPct = ((end - start) / totalDuration) * 100;
            const color = ACTIVITY_COLORS[a.activity] || 'bg-gray-500';

            return (
              <div key={i} className="relative">
                <div className="flex items-center gap-4 mb-1">
                  <span className="text-xs text-gray-400 w-48 truncate font-medium">
                    {a.activity.replace(/_/g, ' ')}
                  </span>
                  <span className={`badge ${a.status === 'COMPLETED' ? 'badge-low' : a.status === 'ACTIVE' ? 'badge-info' : 'badge-medium'} text-[9px]`}>
                    {a.status}
                  </span>
                </div>
                <div className="relative h-8 bg-gray-800 rounded-md overflow-hidden">
                  <div
                    className={`absolute h-full ${color} rounded-md opacity-80 transition-all duration-500 flex items-center px-2`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  >
                    <span className="text-[10px] text-white font-mono truncate">
                      {new Date(a.start).toLocaleTimeString()} – {new Date(a.end).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            No activities in the timeline. Generate a plan to populate.
          </p>
        )}
      </div>

      {/* Activity Details Table */}
      {activities.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 font-medium">Activity</th>
                <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 font-medium">Start</th>
                <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 font-medium">End</th>
                <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 font-medium">Reason</th>
                <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => (
                <tr key={i} className="border-b border-[#1f2937]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-200">{a.activity}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{new Date(a.start).toLocaleTimeString()}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{new Date(a.end).toLocaleTimeString()}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs max-w-xs truncate">{a.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${a.status === 'COMPLETED' ? 'badge-low' : a.status === 'ACTIVE' ? 'badge-info' : 'badge-medium'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
