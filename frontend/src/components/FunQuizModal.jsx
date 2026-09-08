import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Trophy, Sparkles } from 'lucide-react';

export default function FunQuizModal({ isOpen, onClose, topic, onRewardPoints }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const quizItems = [
    {
      question: `Which study strategy best combats procrastination for "${topic || 'General Study'}"?`,
      options: [
        'Breaking tasks into 25-minute Pomodoro focus sprints with zero distractions',
        'Waiting until the night before the deadline to start studying',
        'Multitasking between social media and lecture notes simultaneously',
        'Studying continuously for 8 hours without taking any breaks'
      ],
      correctIndex: 0,
      explanation: 'Empirical survey results show structured focus sprints prevent fatigue and last-minute stress.'
    },
    {
      question: 'What is the primary benefit of self-monitoring and distraction tracking?',
      options: [
        'It causes unnecessary pressure without feedback',
        'It builds awareness of digital temptation patterns so you can self-correct',
        'It disables all computer functions permanently',
        'It eliminates the need for daily study planning'
      ],
      correctIndex: 1,
      explanation: 'Tracking distraction events increases cognitive discipline and deep work focus.'
    },
    {
      question: 'How should you organize your task queue based on SCAMPER energy levels?',
      options: [
        'Do low priority tasks during peak energy hours',
        'Rearrange high-priority, difficult tasks for when your energy and concentration are highest',
        'Ignore deadline dates completely',
        'Postpone all academic tasks until the final hour'
      ],
      correctIndex: 1,
      explanation: 'Matching task difficulty with your peak cognitive energy maximizes learning retention.'
    }
  ];

  const handleSelectOption = (index) => {
    setSelectedOpt(index);
  };

  const handleNext = () => {
    if (selectedOpt === quizItems[currentStep].correctIndex) {
      setScore(prev => prev + 1);
    }
    setSelectedOpt(null);

    if (currentStep + 1 < quizItems.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      onRewardPoints(25);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOpt(null);
    setScore(0);
    setIsCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="studysync-card max-w-lg w-full p-6 bg-white border border-blue-200 shadow-2xl space-y-4">
        {!isCompleted ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>Fun Daily Recall Quiz ({currentStep + 1}/{quizItems.length})</span>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                +25 Bonus Points
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                {quizItems[currentStep].question}
              </h3>

              <div className="space-y-2">
                {quizItems[currentStep].options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold border transition-all ${
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
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                disabled={selectedOpt === null}
                className="px-6 py-2.5 rounded-xl btn-primary-blue font-extrabold text-xs disabled:opacity-50"
              >
                {currentStep + 1 === quizItems.length ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-md border border-emerald-200">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                You scored {score} out of {quizItems.length}! You earned <strong className="text-emerald-600">+25 Bonus Points</strong>!
              </p>
            </div>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 rounded-xl btn-primary-blue font-extrabold text-xs"
            >
              Collect Rewards & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
