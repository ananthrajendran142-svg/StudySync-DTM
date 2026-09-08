import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { Clock, ShieldAlert, Zap, CheckCircle2, ArrowUpRight, Flame, AlertCircle } from 'lucide-react';

export default function Dashboard({ stats, logs, onStartFocus }) {
  const chartData = [
    { day: 'Mon', focusMins: 45, distractions: 2 },
    { day: 'Tue', focusMins: 90, distractions: 1 },
    { day: 'Wed', focusMins: 60, distractions: 3 },
    { day: 'Thu', focusMins: 120, distractions: 0 },
    { day: 'Fri', focusMins: 75, distractions: 1 },
    { day: 'Sat', focusMins: 150, distractions: 2 },
    { day: 'Sun', focusMins: stats.totalFocusMinutes || 50, distractions: stats.totalDistractions || 1 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-slate-900/80 to-cyan-900/40 border border-purple-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Welcome back, <span className="text-gradient">Arun</span> 👋
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Self-proctored learning system active. Eliminate digital distractions, boost consistency, and master your subjects.
            </p>
          </div>
          <button
            onClick={onStartFocus}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 font-bold text-white shadow-lg shadow-purple-500/30 transition-all transform hover:scale-105"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>Launch Focus Room</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Focus Time</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{stats.totalFocusMinutes} <span className="text-xs font-normal text-slate-400">mins</span></div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18% from last week
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Proctor Score</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{stats.focusScore}%</div>
            <div className="flex items-center gap-1 text-xs font-medium text-purple-400 mt-1">
              Deep work efficiency
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tab Switches</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{stats.totalDistractions}</div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400 mt-1">
              Logged by proctoring
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Streak</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{stats.streak} <span className="text-xs font-normal text-slate-400">days</span></div>
            <div className="flex items-center gap-1 text-xs font-medium text-amber-400 mt-1">
              Active learning streak
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Focus Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Study Focus vs. Distractions</h3>
              <p className="text-xs text-slate-400">Weekly focused minutes vs tab-switch incidents</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-purple-300 border border-slate-700">
              7-Day Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="focusMins" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" name="Focused Minutes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proctoring Event Feed */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" /> Live Proctor Feed
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No proctoring incidents logged yet. Great focus!
                </div>
              ) : (
                logs.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start gap-3">
                    {log.type === 'distraction' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-200">{log.message}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{log.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Self-Proctor Status:</span>
            <span className="text-emerald-400 font-semibold">Active & Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}
