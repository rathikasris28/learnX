import React from 'react';
import { X, Search, Share2, Target, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileActionModal: React.FC = () => {
  const { isMobileActionModalOpen, setIsMobileActionModalOpen, setActiveView } = useApp();

  if (!isMobileActionModalOpen) return null;

  const actions = [
    {
      title: 'Find Learning Partner',
      desc: 'Browse verified mentors for 1-to-1 peer sessions',
      icon: <Search className="w-5 h-5 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200 text-teal-900',
      action: () => {
        setIsMobileActionModalOpen(false);
        setActiveView('learn');
      }
    },
    {
      title: 'Share Knowledge',
      desc: 'List your skills, set availability, and earn Time Credits',
      icon: <Share2 className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      action: () => {
        setIsMobileActionModalOpen(false);
        setActiveView('teach');
      }
    },
    {
      title: 'Create Learning Goal',
      desc: 'Follow personalized AI milestones and tracks',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      action: () => {
        setIsMobileActionModalOpen(false);
        setActiveView('my-learning');
      }
    },
    {
      title: 'Register for Partner Course',
      desc: 'Join industry webinar series & earn certificates',
      icon: <Award className="w-5 h-5 text-cyan-600" />,
      color: 'bg-cyan-50 border-cyan-200 text-cyan-900',
      action: () => {
        setIsMobileActionModalOpen(false);
        setActiveView('courses');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in slide-in-from-bottom-6 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Quick Actions
              </h3>
              <p className="text-xs text-slate-500">Choose what you want to do today</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileActionModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {actions.map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] ${item.color}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white shadow-xs">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs opacity-80 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Time Credits have no cash value • Non-monetary peer learning
          </p>
        </div>
      </div>
    </div>
  );
};
