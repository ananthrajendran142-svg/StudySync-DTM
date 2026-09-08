import React, { useState } from 'react';
import { Sparkles, Send, Bot, Lightbulb, Target, Zap, BookOpen } from 'lucide-react';
import { queryRAGChat } from '../services/api';

export default function AIAssistantView({ userProfile, documents }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hi ${userProfile?.name || 'Ananth'}! 👋\nHow can I help you today?`,
      sources: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const promptChips = [
    { icon: '💡', text: "Suggest a study plan for me" },
    { icon: '🎯', text: "What should I focus on next?" },
    { icon: '⚡', text: "Give me tips to stay consistent" },
    { icon: '📖', text: "Explain this topic simply" },
  ];

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isQuerying) return;

    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setIsQuerying(true);

    try {
      const res = await queryRAGChat(q, 3);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer,
          sources: res.retrieved_chunks ? res.retrieved_chunks.map(c => `${c.filename} (Chunk #${c.chunk_id})`) : []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'RAG request processed. Connect to Python backend on port 8000 for live vector search.',
          sources: []
        }
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      {/* Header Card */}
      <div className="studysync-card p-6 bg-white border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">AI Assistant</h2>
            <p className="text-xs text-slate-500 font-medium">Get personalized recommendations & support.</p>
          </div>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="studysync-card p-6 bg-white border border-slate-200 space-y-4 flex flex-col h-[500px]">
        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'btn-primary-blue text-white rounded-br-none font-medium'
                    : 'bg-blue-50/80 border border-blue-100 text-slate-800 rounded-bl-none font-medium'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200/60 text-[10px] text-blue-700 font-bold">
                    📚 RAG Sources: {m.sources.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isQuerying && (
            <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
              <Sparkles className="w-4 h-4 animate-spin" /> Querying Python RAG vector store...
            </div>
          )}
        </div>

        {/* 4 Quick Prompt Chips (Frame #9) */}
        {messages.length <= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.text)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all flex items-center gap-2.5"
              >
                <span className="text-base">{chip.icon}</span>
                <span>{chip.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="pt-2 border-t border-slate-100 flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isQuerying}
            className="p-3 rounded-xl btn-primary-blue font-bold flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
