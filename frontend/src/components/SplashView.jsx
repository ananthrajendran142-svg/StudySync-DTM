import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function SplashView({ onGetStarted, onLogin }) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto">
      {/* Brand Icon Card */}
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6 animate-pulse-slow">
        <span className="text-5xl">🎓</span>
      </div>

      {/* Brand Title & Tagline */}
      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
        StudySync
      </h1>
      <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-6 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
        Plan • Focus • Track • Improve
      </div>

      {/* Hero Illustration / Icon Card */}
      <div className="glass-card rounded-3xl p-8 border border-indigo-500/30 w-full mb-8 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center mx-auto mb-4 border border-indigo-500/40">
          <Zap className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">
          Reducing Student Procrastination Through Smart and Self-Directed Learning
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Master your academic goals with self-proctored focus sessions, intelligent study planning, peer group sessions, and RAG AI study recommendations.
        </p>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={onGetStarted}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onLogin}
          className="w-full py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
        >
          Sign In to Existing Account
        </button>
      </div>
    </div>
  );
}
