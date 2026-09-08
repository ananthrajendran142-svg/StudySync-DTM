import React, { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, HelpCircle, CheckCircle2, XCircle, Cpu } from 'lucide-react';
import { queryRAGChat, getProctorCoaching, generateInteractiveQuiz } from '../services/api';

export default function RAGCoach({ stats, streak, documents }) {
  const [activeSubTab, setActiveSubTab] = useState('chat'); // 'chat', 'coaching', 'quiz'
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your RAG & NLM AI Study Coach. Ask me any question about your course materials or study strategy.',
      sources: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  // Coaching state
  const [coachingData, setCoachingData] = useState(null);
  const [loadingCoaching, setLoadingCoaching] = useState(false);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('Operating Systems & Memory');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Handle RAG Chat submit
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isQuerying) return;

    const userText = inputQuery;
    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsQuerying(true);

    try {
      const res = await queryRAGChat(userText, 3);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer,
          provider: res.provider,
          sources: res.retrieved_chunks ? res.retrieved_chunks.map(c => `${c.filename} (Chunk #${c.chunk_id})`) : []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Backend request failed. Make sure Python FastAPI is running on http://127.0.0.1:8000.',
          sources: []
        }
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  // Handle Fetch NLM Coaching
  const handleFetchCoaching = async () => {
    setLoadingCoaching(true);
    try {
      const res = await getProctorCoaching(
        stats.totalDistractions || 0,
        stats.totalFocusMinutes || 0,
        streak || 1
      );
      setCoachingData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoaching(false);
    }
  };

  // Handle Generate Quiz
  const handleGenerateQuiz = async () => {
    setLoadingQuiz(true);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    try {
      const res = await generateInteractiveQuiz(quizTopic);
      setQuizQuestions(res.quiz || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" /> RAG & NLM AI Study Coach
          </h2>
          <p className="text-sm text-slate-400">
            Powered by Retrieval-Augmented Generation (RAG) and Python Neural Language Models.
          </p>
        </div>

        {/* Subtab navigation */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'chat' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            RAG Q&A
          </button>
          <button
            onClick={() => { setActiveSubTab('coaching'); if(!coachingData) handleFetchCoaching(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'coaching' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Proctor Advice
          </button>
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'quiz' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Auto Quiz
          </button>
        </div>
      </div>

      {/* Subtab 1: RAG Q&A Chat */}
      {activeSubTab === 'chat' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col h-[520px]">
          {/* Chat message feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-purple-300">
                      <span className="font-bold">📚 RAG Sources:</span> {m.sources.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isQuerying && (
              <div className="flex items-center gap-2 text-xs text-purple-400">
                <Sparkles className="w-4 h-4 animate-spin" /> Retrieving vector chunks & generating answer...
              </div>
            )}
          </div>

          {/* Input box */}
          <form onSubmit={handleSendChat} className="mt-4 pt-4 border-t border-slate-800/80 flex gap-3">
            <input
              type="text"
              placeholder="Ask a question about your indexed study materials..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isQuerying}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Ask RAG
            </button>
          </form>
        </div>
      )}

      {/* Subtab 2: NLM Proctor Coaching */}
      {activeSubTab === 'coaching' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" /> Behavioral Anti-Procrastination Coaching
            </h3>
            <button
              onClick={handleFetchCoaching}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 border border-slate-700"
            >
              Re-analyze Focus Logs
            </button>
          </div>

          {loadingCoaching ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Analyzing distraction logs with NLM engine...
            </div>
          ) : coachingData ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/30">
                <h4 className="font-extrabold text-lg text-purple-300">{coachingData.headline}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{coachingData.advice}</p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-900/20 border border-cyan-500/30 text-xs text-cyan-200">
                <span className="font-bold uppercase tracking-wider block text-[10px] text-cyan-400 mb-1">Actionable Tip</span>
                {coachingData.actionable_tip}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Subtab 3: Auto Quiz */}
      {activeSubTab === 'quiz' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" /> Auto-Generated Study Quiz
              </h3>
              <p className="text-xs text-slate-400">Generate interactive quizzes from indexed RAG documents.</p>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={loadingQuiz}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md"
            >
              {loadingQuiz ? 'Generating...' : 'Generate New Quiz'}
            </button>
          </div>

          {quizQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Click "Generate New Quiz" to test your recall on uploaded materials.
            </div>
          ) : (
            <div className="space-y-6">
              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs text-white">
                    Q{idx + 1}. {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = q.correct_index === optIdx;
                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optIdx })}
                          className={`w-full text-left p-3 rounded-xl text-xs border transition-all ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                                : isSelected
                                ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                              : isSelected
                              ? 'bg-purple-600/30 border-purple-500 text-white font-semibold'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-950/80 text-[11px] text-slate-300 border border-slate-800">
                      💡 <span className="font-semibold">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted && (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Submit & View Results
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
