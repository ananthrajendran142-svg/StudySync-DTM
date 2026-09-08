import React, { useState } from 'react';
import { User, Mail, Lock, BookOpen, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterView({ userProfile, setUserProfile, onCompleteRegister, onSwitchToLogin, onBack }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Department of Information Technology');
  const [studyGoalMins, setStudyGoalMins] = useState(120);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name: name || 'Ananth R',
      studentId: studentId || 'RA2511008020022',
      email: email || 'ananth@srmist.edu.in',
      department: department || 'Department of Information Technology',
      studyGoalMins: Number(studyGoalMins) || 120,
      isAuthenticated: true,
    });
    onCompleteRegister();
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      <div className="studysync-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 w-full shadow-2xl space-y-5 relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl mx-auto mb-2 shadow-md shadow-blue-500/20">
            🎓
          </div>
          <h2 className="text-2xl font-black text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Register to start your self-directed learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Ananth R"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Registration No.</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="e.g. ananth@srmist.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl btn-primary-blue font-extrabold text-sm shadow-md mt-2"
          >
            Create Account & Get Started
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-1">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 font-extrabold hover:underline"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
