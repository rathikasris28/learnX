import React from 'react';
import { Bell, CheckCircle2, ShieldCheck, Star, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PageShell: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div><h1 className="text-3xl font-extrabold text-slate-900 font-heading">{title}</h1><p className="text-sm text-slate-500 mt-1">{description}</p></div>
    {children}
  </div>
);

export const ProfilePage: React.FC = () => {
  const { currentUser, setActiveView } = useApp();
  if (!currentUser) return null;
  return <PageShell title="Profile" description="Your learning identity, skills, and trust signals.">
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
      <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-3xl object-cover" />
      <div className="flex-1"><div className="flex flex-wrap gap-2 items-center"><h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2><span className="px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase">{currentUser.role}</span></div><p className="text-slate-600 mt-2">{currentUser.bio}</p><div className="flex flex-wrap gap-2 mt-4">{[...currentUser.skillsLearning, ...currentUser.skillsTeaching].map(skill => <span key={skill} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">{skill}</span>)}</div></div>
      <button onClick={() => setActiveView('policy')} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-teal-300">Trust & safety</button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[['Trust score', `${currentUser.trustScore}/100`, ShieldCheck], ['Reliability', `${currentUser.reliabilityScore}%`, CheckCircle2], ['Rating', currentUser.rating.toFixed(1), Star]].map(([label, value, Icon]) => <div key={String(label)} className="bg-white rounded-2xl border border-slate-200 p-5"><Icon className="w-5 h-5 text-teal-600" /><p className="text-2xl font-extrabold text-slate-900 mt-3">{value as string}</p><p className="text-xs text-slate-500">{label as string}</p></div>)}</div>
  </PageShell>;
};

export const AchievementsPage: React.FC = () => {
  const { achievements } = useApp();
  return <PageShell title="Achievements" description="Recognition for meaningful learning and knowledge sharing progress."><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{achievements.map(achievement => <div key={achievement.id} className={`bg-white rounded-2xl border p-5 ${achievement.unlocked ? 'border-teal-200' : 'border-slate-200 opacity-70'}`}><div className="flex items-center justify-between"><Trophy className="w-7 h-7 text-amber-500" /><span className="text-xs font-bold text-slate-500">{achievement.progress}%</span></div><h2 className="font-bold text-slate-900 mt-4">{achievement.title}</h2><p className="text-sm text-slate-500 mt-1">{achievement.description}</p><div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden"><div className="h-full bg-teal-500" style={{ width: `${achievement.progress}%` }} /></div></div>)}</div></PageShell>;
};

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  return <PageShell title="Notifications" description="Stay current with sessions, recommendations, and learning progress."><div className="flex justify-end"><button onClick={markAllNotificationsAsRead} className="text-sm font-bold text-teal-700">Mark all as read</button></div><div className="space-y-3">{notifications.map(notification => <button key={notification.id} onClick={() => markNotificationAsRead(notification.id)} className={`w-full text-left bg-white rounded-2xl border p-5 flex gap-4 ${notification.read ? 'border-slate-200' : 'border-teal-300 bg-teal-50/30'}`}><Bell className={`w-5 h-5 shrink-0 ${notification.read ? 'text-slate-400' : 'text-teal-600'}`} /><span><strong className="block text-slate-900">{notification.title}</strong><span className="block text-sm text-slate-600 mt-1">{notification.message}</span><small className="block text-slate-400 mt-2">{notification.timestamp}</small></span></button>)}</div></PageShell>;
};
