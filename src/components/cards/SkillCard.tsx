import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ArrowUpRight, Users, Sparkles } from 'lucide-react';
import { SkillItem } from '../../types';
import { useApp } from '../../context/AppContext';

export const SkillCard: React.FC<{ skill: SkillItem; onClick?: () => void }> = ({
  skill,
  onClick
}) => {
  const { setActiveView } = useApp();

  // Dynamically resolve lucide icon safely
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[skill.iconName] || LucideIcons.BookOpen;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setActiveView('learn');
    }
  };

  const isTechnical = skill.category === 'technical';

  return (
    <div
      id={`skill-card-${skill.id}`}
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl hover:border-teal-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isTechnical
                ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
              isTechnical
                ? 'bg-blue-50/80 text-blue-700 border-blue-200'
                : 'bg-teal-50/80 text-teal-700 border-teal-200'
            }`}
          >
            {skill.category}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base font-heading group-hover:text-teal-600 transition-colors flex items-center justify-between">
          <span>{skill.name}</span>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </h3>

        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {(skill.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-teal-600" />
          <span>
            <strong>{skill.popularMentorsCount}</strong> mentors
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          {skill.learnersCount} learners
        </span>
      </div>
    </div>
  );
};
