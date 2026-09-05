import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hi! I can explain a topic simply, create practice questions, or help you revise.' }]);
  const prompts = ['Explain simply', 'Give an example', 'Create practice questions', 'Help me revise'];
  const sendMessage = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;
    setMessages(prev => [...prev, { from: 'user', text: cleanText }, { from: 'ai', text: `Here is a simple way to approach “${cleanText}”: break it into one idea, one example, and one practice task. Try explaining it back in your own words.` }]);
    setInput('');
  };
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white flex items-center justify-center"><Bot className="w-6 h-6" /></div><div><span className="text-xs font-bold uppercase tracking-wider text-teal-700">LearnX AI</span><h1 className="text-3xl font-extrabold text-slate-900 font-heading">Learning Assistant</h1></div></div><div className="bg-white rounded-3xl border border-slate-200 shadow-sm mt-6 overflow-hidden"><div className="min-h-[360px] p-5 space-y-4">{messages.map((message, index) => <div key={`${message.from}-${index}`} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.from === 'user' ? 'bg-slate-900 text-white' : 'bg-teal-50 text-slate-800 border border-teal-100'}`}>{message.text}</div></div>)}</div><div className="px-5 pb-4 flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} onClick={() => sendMessage(prompt)} className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 text-xs font-semibold text-slate-700">{prompt}</button>)}</div><form onSubmit={event => { event.preventDefault(); sendMessage(input); }} className="border-t border-slate-200 p-4 flex gap-2"><input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about something you are learning..." className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /><button aria-label="Send message" className="w-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center"><Send className="w-4 h-4" /></button></form></div><p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Prototype responses are local mock AI output, ready for a future AI service.</p></div>;
};
