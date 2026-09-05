import React from 'react';
import {
  Star,
  ShieldCheck,
  Award,
  Clock,
  Calendar,
  Languages,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrainerAvailabilityBadge, TrustScoreBadge, ReliabilityBadge, SkillProofBadge } from '../../components/common/BadgeComponents';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';

export const TrainerProfilePage: React.FC = () => {
  const {
    selectedTrainer,
    trainers,
    setActiveView,
    setIsScheduleModalOpen,
    setIsReportModalOpen
  } = useApp();

  // Fallback to first trainer if none selected
  const trainer = selectedTrainer || trainers[0];

  if (!trainer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600">Trainer not found.</p>
        <button
          onClick={() => setActiveView('learn')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => setActiveView('learn')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Peer Mentors</span>
      </button>

      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner Gradient */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 relative">
          <div className="absolute top-4 right-4">
            <TrainerAvailabilityBadge status={trainer.status} />
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={trainer.avatar}
                alt={trainer.name}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                    {trainer.name}
                  </h1>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                    {trainer.aiMatchScore}% AI Match
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {trainer.title}{trainer.location ? ` • ${trainer.location}` : ''}
                </p>
              </div>
            </div>

            {/* Action booking button */}
            <div className="flex items-center gap-2">
              <button
                id="btn-schedule-session-profile"
                onClick={() => setIsScheduleModalOpen(true)}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 hover:from-teal-300 hover:to-cyan-200 shadow-md transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>SCHEDULE 1-ON-1 SESSION (1 Credit)</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{trainer.rating} / 5.0</span>
                <span className="text-slate-500 text-[10px]">{trainer.reviewsCount} peer reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{trainer.trustScore}% Trust</span>
                <span className="text-slate-500 text-[10px]">Verified credentials</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{trainer.reliabilityScore}% Reliability</span>
                <span className="text-slate-500 text-[10px]">{trainer.completedSessions} sessions done</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{(trainer.languages || []).join(', ') || 'English'}</span>
                <span className="text-slate-500 text-[10px]">Fluent instruction</span>
              </div>
            </div>
          </div>

          {/* Bio & Approach */}
          <div className="pt-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                About the Knowledge Sharer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                {trainer.bio}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
              <span className="font-bold text-slate-800">Teaching Philosophy:</span>
              <p className="text-slate-600 leading-relaxed">
                "{trainer.teachingStyles?.join(', ') || 'Interactive and Practical'} — I focus on breaking down complex problems into manageable steps, encouraging hands-on experimentation, and providing constructive feedback."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Verified Skills & Available Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Verified Skills & SkillProof */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Verified Skills & SkillProof
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Skills validated through peer evaluations, quizzes, and verified knowledge sharing sessions.
          </p>

          <div className="space-y-3 pt-2">
            {(trainer.skills || []).map((skill) => {
              const name = typeof skill === 'string' ? skill : skill.name;
              const level = typeof skill === 'string' ? 'self-claimed' : skill.level;
              const years = typeof skill === 'string' ? '1+' : (skill.experienceYears ?? '1+');
              return (
                <div
                  key={name}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block">{name}</span>
                    <span className="text-[10px] text-slate-500">Verified • {years} yrs experience</span>
                  </div>
                  <SkillProofBadge level={level} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Upcoming Open Slots
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select an available slot to book a 45-minute live 1-on-1 session.
            </p>

            <div className="space-y-2 pt-3">
              {(trainer.availabilitySlots || []).map((slot) => {
                const isAvail = slot.status === 'available';
                return (
                  <div
                    key={slot.time}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isAvail
                        ? 'border-teal-100 bg-teal-50/50'
                        : 'border-slate-200 bg-slate-100 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{slot.time}</span>
                      <span className="text-[10px] ml-2 text-slate-500 capitalize">({slot.status})</span>
                    </div>
                    <button
                      disabled={!isAvail}
                      onClick={() => setIsScheduleModalOpen(true)}
                      className={`px-3 py-1 font-bold rounded-lg text-xs ${
                        isAvail
                          ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Select
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Session duration: <strong>45 minutes</strong></span>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-slate-400 hover:text-red-600 flex items-center gap-1 text-[11px]"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Trainer</span>
            </button>
          </div>
        </div>

      </div>

      {/* Peer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {(() => {
          const reviews = trainer.reviews || [
            {
              id: 'rev_1',
              authorName: 'Sneha Roy',
              rating: 5,
              date: '3 days ago',
              comment: 'Incredible session! Made complex concepts so intuitive and patient with every question.'
            },
            {
              id: 'rev_2',
              authorName: 'Rahul Verma',
              rating: 5,
              date: '1 week ago',
              comment: 'Great practical feedback and clear exercises. Gained massive confidence in just 45 minutes.'
            }
          ];

          return (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Verified Peer Reviews ({reviews.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Only learners who completed verified 1-on-1 sessions can leave evaluations.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{trainer.rating} Average</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                          {rev.authorName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">
                            {rev.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};
