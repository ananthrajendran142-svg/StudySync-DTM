import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Sparkles, UserX, Award, FileText } from 'lucide-react';
import { generateInteractiveQuiz } from '../services/api';

export default function GroupProctoredQuizModal({ 
  isOpen, 
  onClose, 
  topic, 
  notesContent, 
  onQuizCompleted, 
  onQuizDisqualified 
}) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setIsDisqualified(false);
    setIsFinished(false);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOpt(null);
    setLoading(true);

    async function fetchQuiz() {
      try {
        const res = await generateInteractiveQuiz(topic || 'Uploaded PDF Notes');
        if (res && res.quiz && res.quiz.length > 0) {
          setQuestions(res.quiz);
        }
      } catch (err) {
        console.warn('PDF quiz generation error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [isOpen, topic]);

  // Tab Exit & Window Blur Strict Quiz Proctoring
  useEffect(() => {
    if (!isOpen || isFinished || isDisqualified) return;

    const handleTabExit = () => {
      if (document.hidden) {
        setIsDisqualified(true);
        onQuizDisqualified('Tab switch detected during proctored PDF AI quiz');
      }
    };

    const handleWindowBlur = () => {
      setIsDisqualified(true);
      onQuizDisqualified('Window focus lost during proctored PDF AI quiz');
    };

    document.addEventListener('visibilitychange', handleTabExit);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleTabExit);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isOpen, isFinished, isDisqualified, onQuizDisqualified]);

  if (!isOpen) return null;

  const handleNext = () => {
    const isCorrect = selectedOpt === questions[currentIdx]?.correct_index;
    const finalScore = score + (isCorrect ? 1 : 0);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setSelectedOpt(null);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      onQuizCompleted(finalScore);
    }
  };

  const percentScore = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const sourceName = questions[currentIdx]?.source || 'Uploaded PDF Study Document';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="studysync-card max-w-xl w-full p-6 bg-white border border-rose-200 shadow-2xl space-y-5 relative">
        {/* Header Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600 font-extrabold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Uploaded PDF AI Quiz • Active Proctoring</span>
          </div>

          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            ⚠️ DO NOT SWITCH TABS
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Analyzing your uploaded PDF study document & constructing questions...</span>
          </div>
        ) : isDisqualified ? (
          /* DISQUALIFICATION MODAL CONTENT */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 border-2 border-rose-400 flex items-center justify-center mx-auto text-3xl shadow-lg">
              <UserX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-rose-600">DISQUALIFIED & REMOVED FROM QUIZ</h3>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Tab switch or window blur was detected during the PDF quiz evaluation. You have been <strong>removed from the quiz</strong> and your score has been voided (0 Score).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold max-w-md mx-auto">
              🚨 Proctoring Infraction Logged • 0 Bonus Points Awarded.
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors shadow-md"
            >
              Acknowledge & Close
            </button>
          </div>
        ) : !isFinished ? (
          /* ACTIVE PDF QUIZ QUESTION CONTENT */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-blue-600 font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Source: {sourceName}
              </span>
            </div>

            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
              {questions[currentIdx]?.question}
            </h3>

            <div className="space-y-2">
              {questions[currentIdx]?.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedOpt(idx)}
                    className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-slate-600">
              💡 <strong className="text-blue-900">Extracted PDF Text Chunk:</strong> {questions[currentIdx]?.explanation}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Leaving tab removes you from quiz.
              </span>

              <button
                onClick={handleNext}
                disabled={selectedOpt === null}
                className="px-6 py-2.5 rounded-xl btn-primary-blue font-extrabold text-xs disabled:opacity-50"
              >
                {currentIdx + 1 === questions.length ? 'Submit & Calculate Score' : 'Next Question'}
              </button>
            </div>
          </div>
        ) : (
          /* QUIZ SUCCESSFUL COMPLETION CONTENT & SCORE DISPLAY */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">PDF Quiz Evaluation Results</h3>
              <div className="text-3xl font-black text-blue-600 mt-2">
                Score: {score} / {questions.length} <span className="text-lg font-bold text-emerald-600">({percentScore}%)</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                You maintained 100% focus on your uploaded PDF notes without tab exits! You earned <strong className="text-emerald-600">+{score * 25} Study Points</strong>!
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl btn-primary-blue font-extrabold text-xs shadow-md"
            >
              Collect Rewards & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
