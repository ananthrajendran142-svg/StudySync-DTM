import React from 'react';
import { Flame, Coins, ShieldCheck, Cpu, User } from 'lucide-react';

export default function Header({ streak, points, isProctorActive, isBackendOnline, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-30 glass-card border-b border-slate-800/60 px-6 py-3 flex items-center justify-between">
      {/* Mobile Title & Menu Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <span className="font-bold text-white text-base">Self-Proctored</span>
      </div>

      {/* Breadcrumb / Title */}
      <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
        <span className="font-semibold text-slate-200 uppercase text-xs tracking-wider">
          {activeTab}
        </span>
      </div>

      {/* Right Stats & Badges */}
      <div className="flex items-center gap-4">
        {/* Backend Status Pill */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isBackendOnline
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <Cpu className="w-3.5 h-3.5" />
          <span>Python Backend: {isBackendOnline ? 'RAG/NLM API Online' : 'Offline Mode'}</span>
        </div>

        {/* Proctoring Status */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isProctorActive
            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 animate-pulse'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isProctorActive ? 'Proctoring ON' : 'Proctoring Standby'}</span>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>{streak} Day Streak</span>
        </div>

        {/* Study Points Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
          <Coins className="w-4 h-4 text-cyan-400" />
          <span>{points} Pts</span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white border border-purple-400/40">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
