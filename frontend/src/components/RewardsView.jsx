import React, { useState } from 'react';
import { Trophy, Flame, Lock, CheckCircle2, Coins, Award } from 'lucide-react';
import CertificateModal from './CertificateModal';

export default function RewardsView({ points, setPoints, streak, stats, userProfile }) {
  const [toggleTab, setToggleTab] = useState('badges'); // 'badges', 'rewards'
  const [showCertModal, setShowCertModal] = useState(false);

  const badges = [
    {
      id: 1,
      title: 'First Focus',
      sub: 'Complete 1 session',
      icon: '🎯',
      unlocked: (stats.totalFocusMinutes || 0) > 0,
    },
    {
      id: 2,
      title: 'Task Master',
      sub: 'Complete 5 tasks',
      icon: '📋',
      unlocked: (stats.completedTasks || 0) >= 5,
    },
    {
      id: 3,
      title: 'Consistency',
      sub: '7 day streak',
      icon: '🔥',
      unlocked: streak >= 7,
    },
    {
      id: 4,
      title: 'Goal Getter',
      sub: 'Complete 10 tasks',
      icon: '🏆',
      unlocked: (stats.completedTasks || 0) >= 10,
    },
    {
      id: 5,
      title: 'Top Learner',
      sub: 'Reach 50% goals',
      icon: '⭐',
      unlocked: (stats.totalFocusMinutes || 0) >= 60,
    },
    {
      id: 6,
      title: 'Study Champ',
      sub: '30 day streak',
      icon: '👑',
      unlocked: streak >= 30,
    },
  ];

  const storeItems = [
    { id: 1, type: 'cert', name: 'Digital Study Certificate', cost: 100, desc: 'Official printable PDF certificate of focus excellence' },
    { id: 2, type: 'shield', name: 'Streak Repair Shield', cost: 150, desc: 'Protects your daily streak if you miss a study day' },
    { id: 3, type: 'badge', name: 'Gold Crown Badge', cost: 200, desc: 'Exclusive Gold Crown avatar aura for your profile' },
  ];

  const handleRedeem = (item) => {
    if (points < item.cost) {
      alert('Not enough points! Complete focus sessions without distractions to earn points.');
      return;
    }

    setPoints(points - item.cost);
    if (item.type === 'cert') {
      setShowCertModal(true);
    } else {
      alert(`Successfully unlocked ${item.name}!`);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      {/* Header Card */}
      <div className="studysync-card p-6 bg-white border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Rewards & Streaks</h2>
            <p className="text-xs text-slate-500 font-medium">Stay motivated with rewards and streaks.</p>
          </div>
        </div>
      </div>

      {/* Day Streak Hero Card */}
      <div className="studysync-card p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-none shadow-xl shadow-amber-600/30 space-y-4 rounded-[20px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
              🔥
            </div>
            <div>
              <div className="text-3xl font-black text-white drop-shadow-sm">{streak || 1} Day Streak</div>
              <div className="text-xs font-bold text-amber-100 tracking-wide mt-0.5">Keep it up! You're doing great!</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-amber-200 font-black uppercase tracking-wider">Study Points</div>
            <div className="text-2xl font-black text-white drop-shadow-sm">{points} Pts</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-950/30 p-0.5 border border-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-200 to-white transition-all duration-500 shadow-md"
            style={{ width: `${Math.min(100, (streak / 7) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Toggle Pill Buttons */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200 border border-slate-300">
        <button
          onClick={() => setToggleTab('badges')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
            toggleTab === 'badges' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Badges
        </button>
        <button
          onClick={() => setToggleTab('rewards')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
            toggleTab === 'rewards' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Rewards
        </button>
      </div>

      {/* Badges Grid */}
      {toggleTab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`studysync-card p-4 text-center border flex flex-col items-center justify-center transition-all ${
                b.unlocked
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-200/90 border-slate-300 shadow-none'
              }`}
            >
              <div className="text-3xl mb-2">{b.icon}</div>
              <div className="font-black text-xs text-slate-900">{b.title}</div>
              <div className={`text-[11px] mt-0.5 font-bold ${b.unlocked ? 'text-slate-600' : 'text-slate-700'}`}>{b.sub}</div>

              <div className="mt-3">
                {b.unlocked ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-300 flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Unlocked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-300 text-slate-800 text-[10px] font-black flex items-center gap-1 border border-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-700" /> Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards Store */}
      {toggleTab === 'rewards' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {storeItems.map((item) => (
            <div key={item.id} className="studysync-card p-4 bg-white border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> {item.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {item.cost} Pts
                </span>
                <button
                  onClick={() => handleRedeem(item)}
                  className="px-3 py-1 rounded-lg btn-primary-blue font-bold text-xs"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        userProfile={userProfile}
        totalFocusMins={stats.totalFocusMinutes || 125}
      />
    </div>
  );
}
