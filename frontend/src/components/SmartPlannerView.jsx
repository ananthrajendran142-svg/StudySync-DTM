import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function SmartPlannerView({ tasks, setTasks, onStartTask }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('High');
  const [deadlineTime, setDeadlineTime] = useState('10:00 AM');
  const [estPomodoros, setEstPomodoros] = useState(2);

  const daysOfWeek = [
    { num: 1, label: 'Mon', date: 21 },
    { num: 2, label: 'Tue', date: 22 },
    { num: 3, label: 'Wed', date: 23 },
    { num: 4, label: 'Thu', date: 24 },
    { num: 5, label: 'Fri', date: 25 },
    { num: 6, label: 'Sat', date: 26 },
    { num: 7, label: 'Sun', date: 27 },
  ];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      subject: subject || 'General Study',
      priority,
      deadlineTime,
      estimatedPomodoros: Number(estPomodoros),
      completed: false,
      day: selectedDay
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setSubject('');
    setShowAddModal(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Smart Planner</h2>
          <p className="text-xs text-slate-500 font-medium">Plan your study schedule and track deadlines.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl btn-primary-blue font-extrabold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      {/* Date Strip */}
      <div className="studysync-card rounded-2xl p-2.5 bg-white border border-slate-200 flex items-center justify-between gap-1 overflow-x-auto shadow-sm">
        {daysOfWeek.map(d => {
          const isSelected = selectedDay === d.num;
          return (
            <button
              key={d.num}
              onClick={() => setSelectedDay(d.num)}
              className={`flex-1 min-w-[50px] py-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/20'
                  : 'text-slate-700 hover:bg-slate-100 font-bold'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider">{d.label}</span>
              <span className="text-sm font-black mt-0.5">{d.date}</span>
            </button>
          );
        })}
      </div>

      {/* Today's Tasks Section Header */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-black text-sm text-slate-900">Today's Tasks</h3>
        <span className="text-xs font-black text-blue-600">
          {completedCount} / {tasks.length} Done
        </span>
      </div>

      {/* Tasks Queue */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="studysync-card rounded-2xl p-12 text-center text-slate-500 text-xs border border-dashed border-slate-300 bg-white">
            No planned tasks yet. Click the "+" button to add your first study task!
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`studysync-card rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button onClick={() => toggleTask(task.id)}>
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                  )}
                </button>

                <div>
                  <h4 className={`text-xs font-black ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-semibold">
                    <span>{task.subject}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" /> {task.deadlineTime || '12:00 PM'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  task.completed ? 'bg-slate-100 text-slate-500' :
                  task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-200' :
                  task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  {task.completed ? 'Completed' : task.priority}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="studysync-card max-w-md w-full rounded-3xl p-6 bg-white border border-slate-200 space-y-4 shadow-2xl">
            <h3 className="font-black text-base text-slate-900">Create New Study Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics - Chapter 4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Physics, English"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary-blue text-xs font-black shadow-md"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
