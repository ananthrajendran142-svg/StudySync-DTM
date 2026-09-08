import React from 'react';
import { Calendar, Clock, Flame, Play, CheckCircle2, Circle, ArrowRight, Bell, User } from 'lucide-react';

export default function HomeView({ userProfile, tasks, setTasks, streak, focusSessionsCount, onStartFocus, onNavigate }) {
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const activeTasks = tasks.filter(t => !t.completed);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      {/* Frame Header Card with Prominent Profile Avatar & Icon */}
      <div className="studysync-card p-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => onNavigate('profile')}
            title="Click to view Profile & Settings"
          >
            {/* User Profile Avatar Icon */}
            <div className="w-13 h-13 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {userProfile?.name ? userProfile.name.charAt(0) : 'A'}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                Hello, {userProfile?.name || 'Ananth'} 👋
              </h2>
              <p className="text-xs text-slate-500 font-medium">Keep going! You're doing great!</p>
            </div>
          </div>

          {/* Top Right Action Icons (Profile Button & Bell) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('profile')}
              className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-bold text-xs flex items-center gap-1 border border-blue-100"
              title="Profile & Settings"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            <button
              className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Today's Tasks */}
        <div className="studysync-card p-4 text-center bg-white border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeTasks.length}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Today's Tasks</div>
        </div>

        {/* Focus Sessions */}
        <div className="studysync-card p-4 text-center bg-white border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900">{focusSessionsCount || 0}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Focus Sessions</div>
        </div>

        {/* Day Streak */}
        <div className="studysync-card p-4 text-center bg-white border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 border border-amber-100">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{streak || 1}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Day Streak</div>
        </div>
      </div>

      {/* Today's Plan Section */}
      <div className="studysync-card p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">Today's Plan</h3>
          <button
            onClick={() => onNavigate('planner')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
              No tasks created yet. Add a study task in Smart Planner!
            </div>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button className="text-slate-400">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">{task.subject || 'General Study'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{task.deadlineTime || '10:00 AM'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    task.completed ? 'bg-slate-100 text-slate-500' :
                    task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-200' :
                    task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    {task.completed ? 'Done' : task.priority || 'Medium'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Prominent Action Button */}
        <button
          onClick={onStartFocus}
          className="w-full py-4 rounded-xl btn-primary-blue font-extrabold text-sm flex items-center justify-center gap-2 mt-4"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Focus Session</span>
        </button>
      </div>
    </div>
  );
}
