import React from 'react';
import { Calendar, CheckCircle2, Clock, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SessionsPage: React.FC = () => {
  const { sessions, currentUser, setSelectedSession, setActiveView } = useApp();
  const visibleSessions = sessions.filter(session => session.learnerId === currentUser?.id || session.trainerId === currentUser?.id || session.trainerName === currentUser?.name);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div><span className="text-xs font-bold uppercase tracking-wider text-teal-700">One-to-one learning</span><h1 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">Sessions</h1><p className="text-sm text-slate-500 mt-1">Your booked, active, and completed peer learning sessions.</p></div>
      {visibleSessions.length === 0 ? <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500">No sessions yet. Visit Learn to find a learning partner.</div> : <div className="space-y-3">{visibleSessions.map(session => <div key={session.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"><div className="flex items-center gap-4"><img src={session.trainerAvatar} alt={session.trainerName} className="w-12 h-12 rounded-2xl object-cover" /><div><h2 className="font-bold text-slate-900">{session.topic}</h2><p className="text-sm text-slate-500">{session.skillTitle} with {session.trainerName}</p><div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{session.date}</span><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{session.time} · {session.duration}</span></div></div></div><div className="flex items-center gap-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${session.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{session.status === 'completed' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}{session.status}</span>{session.status !== 'completed' && <button onClick={() => { setSelectedSession(session); setActiveView('session-room'); }} className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5"><Video className="w-3.5 h-3.5" />Open room</button>}</div></div>)}</div>}
    </div>
  );
};
