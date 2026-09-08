import React from 'react';
import { Award, Printer, X, ShieldCheck } from 'lucide-react';

export default function CertificateModal({ isOpen, onClose, userProfile, totalFocusMins }) {
  if (!isOpen) return null;

  const totalHours = (totalFocusMins / 60).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white max-w-2xl w-full rounded-3xl p-8 border-4 border-amber-400 shadow-2xl space-y-6 relative text-slate-900 font-serif">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center space-y-2 border-b border-amber-200 pb-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-700 text-3xl font-sans mb-1">
            🎓
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-amber-800">
            Certificate of Study Excellence
          </h2>
          <p className="text-xs font-sans text-slate-500 tracking-wide uppercase font-semibold">
            SRM Institute of Science and Technology • Self-Proctored Learning Excellence
          </p>
        </div>

        {/* Body Text */}
        <div className="text-center space-y-4 py-2 font-sans">
          <p className="text-xs text-slate-600 uppercase font-semibold tracking-wider">
            This certificate is proudly awarded to
          </p>
          <h3 className="text-3xl font-black text-indigo-950 font-serif tracking-tight">
            {userProfile?.name || 'Ananth R'}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Registration ID: {userProfile?.studentId || 'RA2511008020022'} • {userProfile?.department || 'Department of Information Technology'}
          </p>

          <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed pt-2">
            For outstanding dedication, cognitive focus, and self-directed academic mastery by completing{' '}
            <strong className="text-indigo-900 font-extrabold">{totalHours} Hours</strong> of self-proctored deep work focus.
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 font-sans text-xs">
          <div className="text-center">
            <div className="font-extrabold text-slate-900">StudySync AI</div>
            <div className="text-[10px] text-slate-500">Self-Proctored System</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white">
              🛡️
            </div>
            <span className="text-[9px] font-bold uppercase text-amber-800 mt-1">Verified Focus</span>
          </div>

          <div className="text-center">
            <div className="font-extrabold text-slate-900">Department of IT</div>
            <div className="text-[10px] text-slate-500">SRMIST Ramapuram</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-sans font-extrabold text-xs shadow-md flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
