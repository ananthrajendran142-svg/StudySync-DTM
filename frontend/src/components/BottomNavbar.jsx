import React from 'react';
import { Home, Calendar, Users, Trophy, User } from 'lucide-react';

export default function BottomNavbar({ activeTab, setActiveTab }) {
  const bottomNavs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'sessions', label: 'Sessions', icon: Users },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around md:hidden">
      {bottomNavs.map(nav => {
        const Icon = nav.icon;
        const isActive = activeTab === nav.id;
        return (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400 stroke-[2.5]' : 'text-slate-400'}`} />
            <span className="text-[10px]">{nav.label}</span>
          </button>
        );
      })}
    </div>
  );
}
