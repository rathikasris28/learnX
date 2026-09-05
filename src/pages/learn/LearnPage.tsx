import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  Users,
  Clock,
  X,
  BookOpen,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_SKILLS } from '../../constants/skillsData';
import { TrainerCard } from '../../components/cards/TrainerCard';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';
import { rankLocalTrainers } from '../../services/matchingService';

export const LearnPage: React.FC = () => {
  const { trainers, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  // Filter logic
  const filteredTrainers = trainers.filter((trainer) => {
    // Search query matches name, title, bio, or skills
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = trainer.name.toLowerCase().includes(q);
      const matchTitle = trainer.title.toLowerCase().includes(q);
      const matchBio = trainer.bio.toLowerCase().includes(q);
      const matchSkills = trainer.skills.some((s) => s.name.toLowerCase().includes(q));
      if (!matchName && !matchTitle && !matchBio && !matchSkills) return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const isTech = selectedCategory === 'technical';
      const hasCategorySkill = trainer.skills.some((sk) => {
        const skillObj = ALL_SKILLS.find((s) => s.name.toLowerCase() === sk.name.toLowerCase());
        return isTech ? skillObj?.category === 'technical' : skillObj?.category === 'non-technical';
      });
      if (!hasCategorySkill) return false;
    }

    // Specific Skill filter
    if (selectedSkill !== 'all' && !trainer.skills.some((s) => s.name === selectedSkill)) {
      return false;
    }

    // Language filter
    if (selectedLanguage !== 'all' && !trainer.languages.includes(selectedLanguage)) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'all' && trainer.status !== selectedStatus) {
      return false;
    }

    // Teaching style
    if (selectedStyle !== 'all' && !trainer.teachingStyles.includes(selectedStyle)) {
      return false;
    }

    return true;
  });

  const rankedTrainers = rankLocalTrainers(
    filteredTrainers,
    {
      skill: selectedSkill,
      languages: selectedLanguage === 'all' ? currentUser?.languages : [selectedLanguage],
      teachingStyle: selectedStyle
    },
    currentUser
  );

  const visibleTrainers = rankedTrainers.map((result) => result.trainer);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSkill('all');
    setSelectedLanguage('all');
    setSelectedStatus('all');
    setSelectedStyle('all');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedSkill !== 'all' ||
    selectedLanguage !== 'all' ||
    selectedStatus !== 'all' ||
    selectedStyle !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Peer Mentor Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Find Knowledge Sharers & Peer Mentors
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Connect with verified community members for 1-on-1 sessions. Use your non-monetary Time Credits to exchange learning time.
        </p>
      </div>

      <TimeCreditNotice />

      {/* Search & Multi-Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g., Python, Spoken English, React) or trainer names..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical Skills</option>
              <option value="non-technical">Non-Technical Skills</option>
            </select>
          </div>

          {/* Skill */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Skills</option>
              {ALL_SKILLS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Live Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Now</option>
              <option value="in-class">In Class</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Teaching Style */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Teaching Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">Any Style</option>
              <option value="Hands-on Project Based">Hands-on Project</option>
              <option value="Beginner Friendly">Beginner Friendly</option>
              <option value="Interactive Fluency Drills">Interactive Drills</option>
              <option value="Code-Along & Problem Solving">Code-Along</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips & Reset */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>
                Showing <strong>{visibleTrainers.length}</strong> trainers ranked by explainable AI compatibility:
              </span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Trainers Grid */}
      {visibleTrainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTrainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            No trainers match your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, switching languages, or resetting filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
