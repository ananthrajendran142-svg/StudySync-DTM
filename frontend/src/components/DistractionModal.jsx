import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Check } from 'lucide-react';

export default function DistractionModal({ isOpen, onClose, onSubmitReason }) {
  const [selectedReason, setSelectedReason] = useState('Research for study task');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const reasons = [
    'Academic research / documentation reference',
    'Social media / entertainment temptation',
    'Message / email notification check',
    'Felt fatigued or lost motivation',
    'Unplanned interruption'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Other' ? customNote : selectedReason;
    onSubmitReason(finalReason || 'Unspecified distraction');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-rose-500/30 shadow-2xl shadow-rose-950/50 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Proctoring Warning: Tab Exit Detected</h3>
            <p className="text-xs text-rose-300 font-medium">Session paused • Focus points deducted</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The self-proctoring monitor detected that you navigated away from your focus tab. In order to build self-monitoring discipline, please record the reason for this distraction event:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {reasons.map((r, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                selectedReason === r
                  ? 'bg-purple-600/20 border-purple-500/60 text-white font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r}
                checked={selectedReason === r}
                onChange={() => setSelectedReason(r)}
                className="hidden"
              />
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedReason === r ? 'border-purple-400 bg-purple-500 text-white' : 'border-slate-600'
              }`}>
                {selectedReason === r && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>{r}</span>
            </label>
          ))}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all"
            >
              Log Incident & Resume Focus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
