import React, { useState } from 'react';
import { User, Settings, Bell, Sun, Moon, HelpCircle, LogOut, Award, ChevronRight, Save } from 'lucide-react';

export default function ProfileView({ userProfile, setUserProfile, onLogout, onNavigate }) {
  const [name, setName] = useState(userProfile?.name || 'Ananth R');
  const [studentId, setStudentId] = useState(userProfile?.studentId || 'RA2511008020022');
  const [showEdit, setShowEdit] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name,
      studentId
    });
    setSavedMsg('Profile updated successfully!');
    setShowEdit(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const toggleTheme = () => {
    setUserProfile({
      ...userProfile,
      theme: userProfile?.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-24">
      {/* Header Card */}
      <div className="studysync-card p-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Manage your account and preferences.</p>
            </div>
          </div>

          <button
            onClick={() => setShowEdit(!showEdit)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Hero Avatar Section */}
      <div className="studysync-card p-6 bg-white border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20">
          {name ? name.charAt(0) : 'A'}
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">{name}</h3>
        <p className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {studentId}
        </p>

        {savedMsg && (
          <div className="text-xs text-emerald-600 font-semibold pt-1">
            ✓ {savedMsg}
          </div>
        )}
      </div>

      {/* Edit Form Modal/Drawer if opened */}
      {showEdit && (
        <form onSubmit={handleSave} className="studysync-card p-5 bg-white border border-blue-200 space-y-3">
          <h4 className="font-extrabold text-xs text-slate-900">Edit Account Details</h4>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 rounded-xl btn-primary-blue font-bold text-xs">
            Save Details
          </button>
        </form>
      )}

      {/* Menu Options List (Frame #10 matching layout) */}
      <div className="studysync-card p-2 bg-white border border-slate-200 space-y-1">
        <button
          onClick={() => onNavigate('tracking')}
          className="w-full p-3.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">My Progress</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigate('planner')}
          className="w-full p-3.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Study Goals</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          className="w-full p-3.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Notifications</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={toggleTheme}
          className="w-full p-3.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            {userProfile?.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="text-xs font-bold text-slate-800">Appearance ({userProfile?.theme === 'dark' ? 'Dark' : 'Light'})</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          className="w-full p-3.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onLogout}
          className="w-full p-3.5 rounded-xl hover:bg-red-50 text-left flex items-center justify-between transition-colors text-red-600"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}
