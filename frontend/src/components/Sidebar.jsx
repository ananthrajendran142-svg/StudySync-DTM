import React from 'react';
import { LayoutDashboard, CalendarCheck, ShieldAlert, Bot, Award, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck, badge: 'Plan' },
    { id: 'focus', label: 'Focus Room', icon: ShieldAlert, badge: 'Proctored' },
    { id: 'coach', label: 'RAG AI Coach', icon: Bot, badge: 'NLM' },
    { id: 'achievements', label: 'Achievements', icon: Award, badge: 'Track' },
  ];

  return (
    <aside className="w-64 glass-card border-r border-slate-800/60 p-5 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white leading-tight tracking-wide">
              Self-Proctored
            </h1>
            <p className="text-xs font-semibold text-purple-400">Learning Excellence</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-purple-500/30 text-purple-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> SRM IT DTM
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Batch 02</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Reducing procrastination via smart self-proctoring, RAG study notes & NLM AI coaching.
        </p>
      </div>
    </aside>
  );
}
