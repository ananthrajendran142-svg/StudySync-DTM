import React from 'react';
import { Award, Lock, CheckCircle2, Sparkles, Coins, ShoppingBag } from 'lucide-react';

export default function Achievements({ points, setPoints, streak, stats }) {
  const badges = [
    {
      id: 1,
      title: 'Distraction-Free Sprint',
      desc: 'Complete a 25-minute Pomodoro session with 0 tab switches.',
      icon: '🛡️',
      unlocked: stats.totalFocusMinutes >= 25 && stats.totalDistractions === 0,
    },
    {
      id: 2,
      title: 'Streak Master',
      desc: 'Maintain an active study streak for 5 or more consecutive days.',
      icon: '🔥',
      unlocked: streak >= 5,
    },
    {
      id: 3,
      title: 'RAG Scholar',
      desc: 'Upload course notes to Python RAG Knowledge Base.',
      icon: '📚',
      unlocked: true,
    },
    {
      id: 4,
      title: 'Focus Champion',
      desc: 'Log over 100 total focused study minutes.',
      icon: '🏆',
      unlocked: stats.totalFocusMinutes >= 100,
    },
    {
      id: 5,
      title: 'Anti-Procrastinator',
      desc: 'Maintain a proctor efficiency score above 90%.',
      icon: '⚡',
      unlocked: stats.focusScore >= 90,
    },
  ];

  const storeItems = [
    {
      id: 'cyber',
      name: 'Cyber Neon Glow Theme',
      cost: 150,
      desc: 'Unlocks a vibrant violet and cyan ambient glow theme.',
    },
    {
      id: 'forest',
      name: 'Forest Rain Soundscape',
      cost: 200,
      desc: 'Deep focus rain audio preset for the Focus Room.',
    },
    {
      id: 'badge',
      name: 'Gold Crown Badge',
      cost: 300,
      desc: 'Display an exclusive Gold Crown avatar aura.',
    },
  ];

  const handleBuyItem = (item) => {
    if (points < item.cost) {
      alert('Not enough points! Complete focus sessions without distractions to earn points.');
      return;
    }
    setPoints(points - item.cost);
    alert(`Successfully unlocked ${item.name}!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" /> Gamification & Achievements
          </h2>
          <p className="text-sm text-slate-400">
            Earn points for self-proctored focus sessions and unlock rewards.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-extrabold text-sm">
          <Coins className="w-5 h-5 text-cyan-400" />
          <span>{points} Study Points Available</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white">Unlockable Badges ({badges.filter(b=>b.unlocked).length} / {badges.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                b.unlocked
                  ? 'bg-purple-900/20 border-purple-500/40 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800">{b.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">{b.title}</h4>
                  {b.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points Store */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-purple-400" /> Points Rewards Store
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {storeItems.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-xs text-white">{item.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {item.cost} Pts
                </span>
                <button
                  onClick={() => handleBuyItem(item)}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
