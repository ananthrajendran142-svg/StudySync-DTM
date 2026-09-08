import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ShieldAlert, Lock, Edit3, Sparkles, FileText, CheckCircle2, Plus, Minus, Clock, Settings2 } from 'lucide-react';
import DistractionModal from './DistractionModal';
import GroupProctoredQuizModal from './GroupProctoredQuizModal';
import { uploadStudyDocument } from '../services/api';

export default function FocusRoom({ currentTask, onSessionComplete, onDistractionDetected, setIsProctorActive }) {
  const [sessionType, setSessionType] = useState('focus'); // 'focus', 'shortBreak', 'longBreak', 'custom'
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [strictShieldMode, setStrictShieldMode] = useState(false);

  // Custom Time Input State
  const [customMinsInput, setCustomMinsInput] = useState(25);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Pre-Focus Notes & Quiz Opt-In State
  const [quizOptIn, setQuizOptIn] = useState(true);
  const [notesStatus, setNotesStatus] = useState('');

  // Modals
  const [showDistractionModal, setShowDistractionModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const [selectedTaskTitle, setSelectedTaskTitle] = useState(currentTask?.title || 'General Study');

  const selectPreset = (type, mins) => {
    setIsRunning(false);
    setIsProctorActive(false);
    setSessionType(type);
    setCustomMinsInput(mins);
    setTotalSeconds(mins * 60);
    setSecondsLeft(mins * 60);
  };

  // Adjust time by +/- 5 minutes
  const adjustMinutes = (deltaMins) => {
    if (isRunning) return;
    const currentMins = Math.floor(secondsLeft / 60);
    const newMins = Math.max(1, Math.min(180, currentMins + deltaMins));
    setCustomMinsInput(newMins);
    setTotalSeconds(newMins * 60);
    setSecondsLeft(newMins * 60);
  };

  // Set custom minutes from input
  const applyCustomMinutes = (mins) => {
    const validMins = Math.max(1, Math.min(180, Number(mins) || 25));
    selectPreset('custom', validMins);
    setShowCustomModal(false);
  };

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsProctorActive(false);
      onSessionComplete(sessionType, Math.round(totalSeconds / 60));
      
      if (quizOptIn) {
        setShowQuizModal(true);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, totalSeconds, sessionType, quizOptIn, onSessionComplete, setIsProctorActive]);

  // Tab Exit & Window Blur Strict Proctoring
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isRunning) {
        setIsRunning(false);
        setIsProctorActive(false);
        setShowDistractionModal(true);
      }
    };

    const handleBlur = () => {
      if (strictShieldMode && isRunning) {
        setIsRunning(false);
        setIsProctorActive(false);
        setShowDistractionModal(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isRunning, strictShieldMode, setIsProctorActive]);

  const handleNotesUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNotesStatus('Indexing study notes into Python RAG AI...');

    try {
      const res = await uploadStudyDocument(file);
      setNotesStatus(`Indexed "${file.name}" for AI Quiz! (${res.document?.chunk_count || 3} chunks)`);
    } catch (err) {
      setNotesStatus(`Notes attached: ${file.name}`);
    }
  };

  const togglePlay = () => {
    const next = !isRunning;

    if (next && strictShieldMode) {
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    }

    setIsRunning(next);
    setIsProctorActive(next);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsProctorActive(false);
    setSecondsLeft(totalSeconds);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-24">
      {/* Main Focus Room Container */}
      <div className="studysync-card p-8 bg-white border border-slate-200 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-slate-900">Proctored Focus Timer</h2>
          </div>

          {/* Strict Shield Toggle */}
          <button
            onClick={() => setStrictShieldMode(!strictShieldMode)}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              strictShieldMode
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Strict Shield: {strictShieldMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Circular Timer Ring + Quick Adjust Steppers */}
        <div className="relative w-64 h-64 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="44"
              className="stroke-slate-100 fill-none"
              strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="44"
              className="stroke-blue-600 fill-none transition-all duration-1000 ease-linear"
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-slate-900 font-mono">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              {sessionType === 'shortBreak' || sessionType === 'longBreak' ? 'Break Time' : 'Focus Time'}
            </span>
          </div>
        </div>

        {/* Adjust Minutes Stepper Controls (-5m / +5m / Custom Time) */}
        {!isRunning && (
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => adjustMinutes(-5)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1"
              title="Decrease 5 mins"
            >
              <Minus className="w-3.5 h-3.5" /> 5m
            </button>

            <button
              onClick={() => setShowCustomModal(true)}
              className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1"
            >
              <Settings2 className="w-3.5 h-3.5" /> Custom Time
            </button>

            <button
              onClick={() => adjustMinutes(5)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1"
              title="Increase 5 mins"
            >
              <Plus className="w-3.5 h-3.5" /> 5m
            </button>
          </div>
        )}

        {/* Subject Label */}
        <div className="flex items-center gap-2 my-1 text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <span>Study Goal: <strong className="text-slate-900">{selectedTaskTitle}</strong></span>
          <Edit3 className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
        </div>

        {/* Pre-Focus Study Notes Uploader */}
        <div className="w-full my-2 p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Pre-Session Study Notes (for AI Quiz)
            </span>
            <label className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] cursor-pointer hover:bg-blue-700 transition-colors">
              Upload Notes
              <input type="file" accept=".pdf,.txt" onChange={handleNotesUpload} className="hidden" />
            </label>
          </div>
          {notesStatus ? (
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {notesStatus}
            </div>
          ) : (
            <div className="text-[11px] text-slate-500">
              Share PDF or TXT notes before starting timer to generate custom post-session AI quiz questions.
            </div>
          )}
        </div>

        {/* Quiz Opt-In Toggle Option */}
        <label className="flex items-center gap-2 my-2 text-xs font-bold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={quizOptIn}
            onChange={(e) => setQuizOptIn(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span>Participate in Post-Session Proctored AI Quiz (+50 Pts)</span>
        </label>

        {/* Control Buttons */}
        <div className="flex items-center gap-3 w-full max-w-xs my-3">
          <button
            onClick={togglePlay}
            className={`flex-1 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
                : 'btn-primary-blue'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Start Focus ({Math.round(totalSeconds / 60)}m)
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Presets & Custom Duration Buttons */}
        <div className="grid grid-cols-4 gap-2 w-full pt-4 mt-2 border-t border-slate-100">
          <button
            onClick={() => selectPreset('focus', 25)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              sessionType === 'focus' && customMinsInput === 25
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-extrabold">25 min</div>
            <div className="text-[9px] text-slate-500">Focus</div>
          </button>

          <button
            onClick={() => selectPreset('custom', 50)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              sessionType === 'custom' && customMinsInput === 50
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-extrabold">50 min</div>
            <div className="text-[9px] text-slate-500">Deep Work</div>
          </button>

          <button
            onClick={() => selectPreset('shortBreak', 5)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              sessionType === 'shortBreak'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-extrabold">5 min</div>
            <div className="text-[9px] text-slate-500">Break</div>
          </button>

          <button
            onClick={() => setShowCustomModal(true)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              sessionType === 'custom'
                ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-extrabold">Custom</div>
            <div className="text-[9px] text-slate-500">Set Mins</div>
          </button>
        </div>
      </div>

      {/* Custom Duration Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="studysync-card max-w-sm w-full p-6 bg-white border border-blue-200 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm">
              <Clock className="w-5 h-5" />
              <span>Set Custom Duration (Minutes)</span>
            </div>

            <p className="text-xs text-slate-500">Enter your desired focus or break duration (1 to 180 minutes):</p>

            <input
              type="number"
              min="1"
              max="180"
              value={customMinsInput}
              onChange={(e) => setCustomMinsInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-extrabold text-center focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => applyCustomMinutes(customMinsInput)}
                className="px-5 py-2 rounded-xl btn-primary-blue text-xs font-extrabold shadow-md"
              >
                Apply Duration
              </button>
            </div>
          </div>
        </div>
      )}

      <DistractionModal
        isOpen={showDistractionModal}
        onClose={() => setShowDistractionModal(false)}
        onSubmitReason={onDistractionDetected}
      />

      <GroupProctoredQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        topic={selectedTaskTitle}
        notesContent={notesStatus}
        onQuizCompleted={() => onSessionComplete('quiz', 0)}
        onQuizDisqualified={(reason) => onDistractionDetected(reason)}
      />
    </div>
  );
}
