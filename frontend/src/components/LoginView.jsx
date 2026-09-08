import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export default function LoginView({ userProfile, setUserProfile, onCompleteLogin, onSwitchToRegister, onBack }) {
  const [studentId, setStudentId] = useState(userProfile?.studentId || 'RA2511008020022');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name: userProfile?.name || 'Ananth R',
      studentId: studentId || 'RA2511008020022',
      email: userProfile?.email || 'ananth@srmist.edu.in',
      isAuthenticated: true,
    });
    onCompleteLogin();
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      <div className="studysync-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 w-full shadow-2xl space-y-5 relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 left-6 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl mx-auto mb-2 shadow-md shadow-blue-500/20">
            🎓
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back!</h2>
          <p className="text-xs text-slate-500 mt-1">
            Login to continue your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Student ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. RA2511008020022"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl btn-primary-blue font-extrabold text-sm shadow-md"
          >
            Login
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span className="text-base">🌐</span> Continue with Google
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span className="text-base">🍎</span> Continue with Apple
          </button>
        </div>

        <div className="text-center text-xs text-slate-500 pt-1">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 font-extrabold hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
