import React, { useState } from 'react';
import { Plus, Play, Trash2, FileText, UploadCloud, CheckCircle2, FileUp, Sparkles } from 'lucide-react';
import { uploadStudyDocument } from '../services/api';

export default function Planner({ tasks, setTasks, onStartTask, documents, setDocuments }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('High');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      subject: subject || 'General Study',
      priority,
      estimatedPomodoros: Number(estimatedPomodoros),
      completedPomodoros: 0,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setSubject('');
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMsg('Parsing document and creating RAG vector embeddings...');

    try {
      const res = await uploadStudyDocument(file);
      setIsUploading(false);
      setUploadMsg(`Indexed "${file.name}" into RAG store! (${res.document.chunk_count} chunks)`);
      if (setDocuments && res.document) {
        setDocuments(prev => [res.document, ...prev]);
      }
    } catch (err) {
      setIsUploading(false);
      setUploadMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Smart Study Planner</h2>
          <p className="text-sm text-slate-400">
            Structure your tasks, set priorities, and upload study notes for Python RAG indexing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Creation & List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Task Form */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Schedule New Study Task
            </h3>
            <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Task title (e.g. Operating Systems Chapter 4 - Memory Management)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subject / Course (e.g. CS201)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>

                <select
                  value={estimatedPomodoros}
                  onChange={(e) => setEstimatedPomodoros(e.target.value)}
                  className="w-32 px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value={1}>1 Pomodoro (25m)</option>
                  <option value={2}>2 Pomodoros (50m)</option>
                  <option value={3}>3 Pomodoros (75m)</option>
                  <option value={4}>4 Pomodoros (100m)</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>
            </form>
          </div>

          {/* Task Queue List */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <h3 className="font-bold text-sm text-white mb-4">Current Task Queue ({tasks.length})</h3>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No planned tasks yet. Add a task above to start your self-proctored focus session.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900/80 border-slate-700/80 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-600 hover:border-purple-400'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div>
                        <h4 className={`font-semibold text-sm ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            {task.subject}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            task.priority === 'High' ? 'bg-rose-500/20 text-rose-300' :
                            task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {task.priority}
                          </span>
                          <span>⏱️ {task.estimatedPomodoros} Pomodoro(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!task.completed && (
                        <button
                          onClick={() => onStartTask(task)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" /> Focus Now
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: RAG Study Material Knowledge Base */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileUp className="w-4 h-4 text-cyan-400" /> RAG Knowledge Base
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Python Vector Index
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Upload course PDFs or text notes. The Python backend will extract text, create vector embeddings, and enable deep RAG search & NLM Q&A.
            </p>

            {/* Dropzone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/50 hover:bg-slate-900/80 group">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-purple-400 transition-all mb-2" />
              <span className="text-xs font-semibold text-slate-300">Click to upload PDF or TXT</span>
              <span className="text-[10px] text-slate-500 mt-1">Course syllabus, lecture notes, textbook slides</span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            {/* Uploading Status Message */}
            {uploadMsg && (
              <div className={`mt-3 p-3 rounded-xl text-xs ${
                uploadMsg.startsWith('Error')
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}>
                {isUploading && <span className="inline-block animate-spin mr-2">⏳</span>}
                {uploadMsg}
              </div>
            )}

            {/* Indexed Documents List */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Indexed Materials ({documents ? documents.length : 0})
              </h4>
              {(!documents || documents.length === 0) ? (
                <div className="text-xs text-slate-500 py-2">No documents indexed yet.</div>
              ) : (
                documents.map((doc, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-medium text-slate-200 truncate">{doc.filename}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                      {doc.chunk_count} chunks
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
