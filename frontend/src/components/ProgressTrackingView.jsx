import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function ProgressTrackingView({ totalFocusMins, tasks }) {
  const [subTab, setSubTab] = useState('overview'); // 'overview', 'subjects', 'reports'

  const chartData = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.2 },
    { day: 'Wed', hours: 1.0 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 4.1 },
    { day: 'Sun', hours: Number((totalFocusMins / 60).toFixed(1)) || 0.5 },
  ];

  const subjects = [
    { name: 'Mathematics', progress: 80, color: 'bg-blue-600' },
    { name: 'Physics', progress: 60, color: 'bg-emerald-500' },
    { name: 'Chemistry', progress: 40, color: 'bg-amber-500' },
    { name: 'English', progress: 70, color: 'bg-purple-600' },
  ];

  const totalHours = (totalFocusMins / 60).toFixed(1);
  const remainingMins = totalFocusMins % 60;

  // Procrastination Risk calculation based on survey model
  const activeTaskCount = tasks.filter(t => !t.completed).length;
  const riskLevel = activeTaskCount > 5 ? 'High Risk' : activeTaskCount > 2 ? 'Moderate' : 'Low Risk';
  const riskColor = riskLevel === 'High Risk' ? 'bg-rose-50 text-rose-600 border-rose-200' : riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200';

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      {/* Header Card */}
      <div className="studysync-card p-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Progress Tracking</h2>
              <p className="text-xs text-slate-500 font-medium">Visualize your learning journey & procrastination risk.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/80 border border-slate-200">
        <button
          onClick={() => setSubTab('overview')}
          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
            subTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSubTab('subjects')}
          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
            subTab === 'subjects' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Subjects
        </button>
        <button
          onClick={() => setSubTab('reports')}
          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
            subTab === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Procrastination Report
        </button>
      </div>

      {/* Study Time Analytics Card */}
      <div className="studysync-card p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Study Time</span>
            <div className="text-3xl font-black text-slate-900 mt-0.5">
              {totalHours}h <span className="text-lg font-semibold text-slate-500">{remainingMins}m</span>
            </div>
            <div className="text-[11px] font-medium text-slate-400">This Week</div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center gap-1 border border-blue-100">
            <TrendingUp className="w-4 h-4" /> Active Learning
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Survey Procrastination Risk Card */}
      <div className="studysync-card p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" /> Procrastination Risk Indicator
          </h3>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${riskColor}`}>
            ● {riskLevel}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Based on empirical survey data across 15+ student participants, procrastination is primarily triggered by <strong>social media distractions (67%)</strong>, <strong>task fatigue (45%)</strong>, and <strong>cramming before deadlines (80%)</strong>.
        </p>

        {/* Actionable Survey Recommendations List */}
        <div className="space-y-2 pt-1">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Survey-Backed Remedies</h4>
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-950 font-bold block">25-Minute Focus Sprints with Phone Lock Shield</strong>
              <span>92% of surveyed students found timed focus blocks with browser lock effective against social media delay.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 font-bold block">Post-Session Recall Quizzes</strong>
              <span>Taking a 2-minute fun quiz after study blocks boosts retention and keeps motivation high.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress Section */}
      <div className="studysync-card p-6 bg-white border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">Subject Progress</h3>
        <div className="space-y-4">
          {subjects.map((sub, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{sub.name}</span>
                <span className="font-extrabold text-slate-900">{sub.progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${sub.color}`}
                  style={{ width: `${sub.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
