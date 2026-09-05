import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Flame,
  Calendar,
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  Video,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';
import { TrainerAvailabilityBadge, TrustScoreBadge, ReliabilityBadge } from '../../components/common/BadgeComponents';
import { findMatchesWithApi, mapApiMatchToTrainer } from '../../services/apiClient';

export const LearnerDashboard: React.FC = () => {
  const {
    currentUser,
    setActiveView,
    sessions,
    trainers,
    setSelectedTrainer,
    setSelectedSession,
    learningPlan
  } = useApp();

  const userName = currentUser?.name || 'Aarav';

  // Trainer availability stats
  const activeCount = trainers.filter(t => t.status === 'active').length;
  const inClassCount = trainers.filter(t => t.status === 'in-class').length;
  const inactiveCount = trainers.filter(t => t.status === 'inactive').length;

  // Upcoming session
  const upcomingSession = sessions.find(s => s.status === 'scheduled');
  const [topMatchTrainer, setTopMatchTrainer] = useState<ReturnType<typeof mapApiMatchToTrainer> | null>(null);
  const [matchStatus, setMatchStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [matchError, setMatchError] = useState('');

  useEffect(() => {
    const targetSkill = currentUser?.skillsLearning[0];
    if (!targetSkill) {
      setMatchStatus('empty');
      return;
    }
    let active = true;
    findMatchesWithApi({ skill: targetSkill, level: currentUser.learningLevel })
      .then(({ matches }) => {
        if (!active) return;
        setTopMatchTrainer(matches[0] ? mapApiMatchToTrainer(matches[0]) : null);
        setMatchStatus(matches.length ? 'ready' : 'empty');
      })
      .catch(() => {
        if (active) {
          setMatchError('Unable to load registered Knowledge Sharers. Please sign in again or restart the backend.');
          setMatchStatus('error');
        }
      });
    return () => { active = false; };
  }, [currentUser?.id, currentUser?.learningLevel, currentUser?.skillsLearning]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Good Morning, {userName} 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 uppercase tracking-wide">
              Learner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exchange. Learn. Grow. Track your daily milestones and active peer sessions.
          </p>
        </div>

        {/* 7-Day Streak Card */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-4 py-2.5 rounded-2xl shadow-xs self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-amber-950 font-heading">
                7 Day Learning Streak!
              </span>
            </div>
            <p className="text-[11px] text-amber-800">
              Consecutive daily knowledge exchange
            </p>
          </div>
        </div>
      </div>

      {/* Non-monetary reminder banner */}
      <TimeCreditNotice />

      {/* Top 3 Quick Widgets: Time Wallet, Next Upcoming Session, Trainer Availability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* WIDGET 1: Time Wallet */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Time Wallet
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-heading mt-1 flex items-baseline gap-2">
                <span>{currentUser?.timeCredits ?? 8}</span>
                <span className="text-sm font-semibold text-teal-600">Time Credits</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Time Credits help users exchange learning time and knowledge. <strong>They have no cash value and are not money.</strong>
          </p>

          <button
            id="learner-view-wallet-btn"
            onClick={() => setActiveView('wallet')}
            className="w-full py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>VIEW WALLET DETAILS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WIDGET 2: Upcoming Session */}
        <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-sm flex flex-col justify-between space-y-4 bg-gradient-to-br from-teal-50/30 to-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-teal-800">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Upcoming Session</span>
              </div>
              {upcomingSession ? (
                <div className="mt-2">
                  <h3 className="text-base font-bold text-slate-900 font-heading truncate">
                    {upcomingSession.skillTitle}: {upcomingSession.topic}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {upcomingSession.date} • {upcomingSession.time} ({upcomingSession.duration})
                  </p>
                  <p className="text-xs text-teal-700 font-medium mt-1">
                    Trainer: <strong>{upcomingSession.trainerName}</strong>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">No session scheduled today.</p>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-md">
              <Video className="w-5 h-5" />
            </div>
          </div>

          {upcomingSession ? (
            <button
              id="learner-join-session-btn"
              onClick={() => {
                setSelectedSession(upcomingSession);
                setActiveView('session-room');
              }}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>JOIN 1-ON-1 SESSION ROOM</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('learn')}
              className="w-full py-2 px-3 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition"
            >
              Schedule a Session
            </button>
          )}
        </div>

        {/* WIDGET 3: Trainer Availability Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Peer Mentors Status
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-heading mt-1">
                Trainer Availability
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Availability breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="block text-base font-extrabold text-emerald-700 font-heading">
                {activeCount}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-800">
                Active
              </span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
              <span className="block text-base font-extrabold text-amber-700 font-heading">
                {inClassCount}
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-800">
                In Class
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
              <span className="block text-base font-extrabold text-slate-600 font-heading">
                {inactiveCount}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Inactive
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveView('learn')}
            className="w-full py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>DISCOVER MENTORS NOW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Grid: YOUR LEARNING & AI RECOMMENDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: YOUR LEARNING PROGRESS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Your Learning
              </h2>
              <p className="text-xs text-slate-500">Track current learning tracks and mastery</p>
            </div>
            <button
              onClick={() => setActiveView('my-learning')}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              <span>View All Tracks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Cards */}
          <div className="space-y-4">
            {/* Python Track (72% Progress) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    PY
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-heading">
                      Python Programming
                    </h3>
                    <p className="text-xs text-slate-500">4-Week Structured Plan • Module 3 of 4</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-teal-600 font-mono">
                  {learningPlan.overallProgress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                  style={{ width: `${learningPlan.overallProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Completed: Variables, Loops, Basic Functions</span>
                <button
                  onClick={() => setActiveView('my-learning')}
                  className="text-teal-700 font-semibold hover:underline"
                >
                  Continue Week 3 →
                </button>
              </div>
            </div>

            {/* English Speaking Track (45% Progress) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                    EN
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-heading">
                      English Speaking & Fluency
                    </h3>
                    <p className="text-xs text-slate-500">Daily Conversational Drills & Accent Reduction</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-teal-600 font-mono">
                  45%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                  style={{ width: `45%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Completed: Introductions & Technical Vocabulary</span>
                <button
                  onClick={() => setActiveView('my-learning')}
                  className="text-teal-700 font-semibold hover:underline"
                >
                  Practice Quiz →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI RECOMMENDATION CARD (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Recommended Match
              </h2>
            </div>
            <span className="text-xs text-slate-400">Match score engine</span>
          </div>

          {matchStatus === 'loading' && <p className="text-sm text-slate-500">Analyzing registered Knowledge Sharers...</p>}
          {matchStatus === 'error' && <p className="text-sm text-red-600">{matchError}</p>}
          {matchStatus === 'empty' && <p className="text-sm text-slate-500">No verified Knowledge Sharers match your learning skills yet.</p>}
          {topMatchTrainer && (
            <div className="bg-white rounded-3xl border border-teal-200/80 p-6 shadow-md bg-gradient-to-b from-teal-50/20 to-white space-y-5">
              <div className="flex items-center justify-between">
                <TrainerAvailabilityBadge status={topMatchTrainer.status} />
                <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-xs">
                  {topMatchTrainer.aiMatchScore}% Match
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={topMatchTrainer.avatar}
                  alt={topMatchTrainer.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-200 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-heading">
                    Learn Python Functions with {topMatchTrainer.name.split(' ')[0]}
                  </h3>
                  <p className="text-xs text-slate-500">{topMatchTrainer.title}</p>
                  <p className="text-[11px] text-teal-700 font-medium mt-0.5">
                    Languages: {topMatchTrainer.languages.join(' + ')}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <p className="font-semibold text-slate-800">Why this match was recommended:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  {topMatchTrainer.matchReasons?.map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              </div>

              <button
                id="btn-view-recommendation"
                onClick={() => {
                  setSelectedTrainer(topMatchTrainer);
                  setActiveView('trainer-profile');
                }}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>VIEW RECOMMENDATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
