import React from 'react';
import { Star, ShieldCheck, Sparkles, Languages, Clock, ArrowRight } from 'lucide-react';
import { Trainer } from '../../types';
import { TrainerAvailabilityBadge, TrustScoreBadge, ReliabilityBadge, SkillProofBadge } from '../common/BadgeComponents';
import { useApp } from '../../context/AppContext';

export const TrainerCard: React.FC<{
  trainer: Trainer;
  onBookClick?: () => void;
}> = ({ trainer, onBookClick }) => {
  const { setSelectedTrainer, setActiveView } = useApp();

  const handleSelect = () => {
    setSelectedTrainer(trainer);
    setActiveView('trainer-profile');
  };

  return (
    <div
      id={`trainer-card-${trainer.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-200 p-5 flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Status & AI Match */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <TrainerAvailabilityBadge
            status={trainer.status}
            nextTime={trainer.nextAvailableTime}
          />
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-500 text-white shadow-xs"
            title="AI Match based on your skill goals, language preference, and learning pace"
          >
            <Sparkles className="w-3 h-3 text-cyan-200" />
            <span>{trainer.aiMatchScore}% Match</span>
          </div>
        </div>

        {/* Profile info */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative">
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
            />
            {trainer.status === 'active' && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-heading group-hover:text-teal-700 transition-colors truncate">
                {trainer.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{trainer.rating}</span>
                <span className="text-slate-400 font-normal">({trainer.reviewsCount})</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{trainer.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                <Languages className="w-3 h-3 text-slate-400" />
                {trainer.languages.join(' + ')}
              </span>
              <span className="text-[11px] text-slate-500">
                {trainer.completedSessions} sessions
              </span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {trainer.bio}
        </p>

        {trainer.matchReasons?.[0] && (
          <p className="text-[11px] text-teal-700 bg-teal-50/70 border border-teal-100 rounded-lg px-2.5 py-1.5 mb-3">
            Why recommended: {trainer.matchReasons[0]}
          </p>
        )}

        {/* Skills with verification badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(trainer.skills || []).map((skill) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            const skillLevel = typeof skill === 'string' ? 'self-claimed' : skill.level;
            return (
              <div key={skillName} className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  {skillName}
                </span>
                <SkillProofBadge level={skillLevel} />
              </div>
            );
          })}
        </div>

        {/* Teaching Style Pills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(trainer.teachingStyles || []).map((style) => (
            <span
              key={style}
              className="text-[10px] font-medium text-teal-800 bg-teal-50/70 border border-teal-200/60 px-2 py-0.5 rounded-full"
            >
              • {style}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Trust scores & Action CTA */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <TrustScoreBadge score={trainer.trustScore} />
          <ReliabilityBadge score={trainer.reliabilityScore} />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleSelect}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
          >
            View Profile
          </button>
          <button
            onClick={() => {
              setSelectedTrainer(trainer);
              if (onBookClick) {
                onBookClick();
              } else {
                setActiveView('trainer-profile');
              }
            }}
            className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
          >
            <span>{trainer.status === 'active' ? `Join ${trainer.name.split(' ')[0]}` : `Learn with ${trainer.name.split(' ')[0]}`}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
