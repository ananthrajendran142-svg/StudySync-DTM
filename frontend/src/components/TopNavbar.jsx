import React from 'react';
import { Timer, Calendar, Users, Trophy, BarChart3, Sparkles, User } from 'lucide-react';

export default function TopNavbar({ activeTab, setActiveTab, userProfile }) {
  const topNavItems = [
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'planner', label: 'Smart Planner', icon: Calendar },
    { id: 'sessions', label: 'Study Sessions', icon: Users },
    { id: 'rewards', label: 'Rewards & Streaks', icon: Trophy },
    { id: 'tracking', label: 'Progress Tracking', icon: BarChart3 },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="studysync-header px-6 py-3.5 shadow-lg border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left Brand Area */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-md shadow-blue-500/30">
            🎓
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">StudySync</h1>
            </div>
            <div className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
              Plan • Focus • Track • Improve
            </div>
          </div>

          <div className="hidden xl:block h-7 w-[1px] bg-slate-700 mx-2"></div>

          <p className="hidden xl:block text-xs text-slate-300 font-medium max-w-xs leading-tight">
            Your smart companion for focused learning and better tomorrow.
          </p>
        </div>

        {/* Right Navigation Icons + Profile Avatar Icon */}
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 group min-w-[64px]"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-400/50 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-blue-400 font-bold' : 'text-slate-300 group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* User Profile Avatar Icon Pill */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ml-2 ${
              activeTab === 'profile'
                ? 'bg-blue-600/30 border-blue-400 text-white ring-2 ring-blue-400/40'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title="View Profile & Settings"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
              {userProfile?.name ? userProfile.name.charAt(0) : 'A'}
            </div>
            <span className="text-xs font-bold hidden sm:inline">{userProfile?.name || 'Profile'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
