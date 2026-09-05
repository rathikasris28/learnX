import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  BookOpen,
  Calendar,
  Video,
  Award,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrainerStatus } from '../../types';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';
import { TrainerAvailabilityBadge, TrustScoreBadge, ReliabilityBadge } from '../../components/common/BadgeComponents';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    setActiveView,
    updateTrainerStatus,
    trainers,
    sessions,
    setSelectedSession,
    showToast
  } = useApp();

  const [currentStatus, setCurrentStatus] = useState<TrainerStatus>('active');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Teacher skills list state
  const [sharedSkills, setSharedSkills] = useState<string[]>([
    'Python',
    'Programming Basics',
    'Data Structures',
    'Web Development'
  ]);

  const teacherName = currentUser?.name || 'Priya Raman';
  const teacherProfile = trainers.find(trainer => trainer.name === teacherName);

  const handleStatusChange = (status: TrainerStatus) => {
    setCurrentStatus(status);
    if (currentUser) {
      updateTrainerStatus(currentUser.id, status);
    }
    showToast(`Your status is now ${status.toUpperCase()}`, 'info');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!sharedSkills.includes(newSkillInput.trim())) {
      setSharedSkills([...sharedSkills, newSkillInput.trim()]);
      showToast(`Added "${newSkillInput.trim()}" to knowledge shared!`, 'success');
    }
    setNewSkillInput('');
    setIsAddingSkill(false);
  };

  const todaysSessions = sessions.filter(session =>
    session.trainerId === currentUser?.id || session.trainerName === teacherName
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Good Morning, {teacherName.split(' ')[0]} 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
              Knowledge Sharer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exchange. Learn. Grow. Manage your knowledge sharing sessions and track earned Time Credits.
          </p>
        </div>

        {/* Status Switcher Component */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 self-start md:self-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Status:
          </span>
          <button
            id="status-btn-active"
            onClick={() => handleStatusChange('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentStatus === 'active'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            ACTIVE
          </button>
          <button
            id="status-btn-in-class"
            onClick={() => handleStatusChange('in-class')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentStatus === 'in-class'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            IN CLASS
          </button>
          <button
            id="status-btn-inactive"
            onClick={() => handleStatusChange('inactive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentStatus === 'inactive'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            INACTIVE
          </button>
        </div>
      </div>

      {/* Non-monetary reminder banner */}
      <TimeCreditNotice />

      {/* Top 3 Stat Cards: TIME CREDITS, PERFORMANCE, SESSIONS COMPLETED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: TIME CREDITS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Time Credits
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-heading mt-1 flex items-baseline gap-2">
                <span>{currentUser?.timeCredits ?? 0}</span>
                <span className="text-sm font-semibold text-teal-600">Credits Balance</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-sm font-extrabold text-emerald-800 font-heading">+{currentUser?.totalEarnedCredits ?? 0}</span>
              <p className="text-[10px] text-emerald-700 font-medium">Total Earned</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
              <span className="text-sm font-extrabold text-slate-800 font-heading">-{currentUser?.totalUsedCredits ?? 0}</span>
              <p className="text-[10px] text-slate-600 font-medium">Used for Learning</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Earned through verified peer sessions. Non-monetary with no cash value.
          </p>
        </div>

        {/* CARD 2: PERFORMANCE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Teaching Reputation
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-heading mt-1">
                Peer Rating & Trust
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-base font-extrabold text-amber-900 font-heading">4.9</span>
              </div>
              <p className="text-[10px] text-amber-700 font-medium">Average Rating</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-base font-extrabold text-blue-900 font-heading">98%</span>
              <p className="text-[10px] text-blue-700 font-medium">Reliability Score</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <TrustScoreBadge score={97} />
            <ReliabilityBadge score={98} />
          </div>
        </div>

        {/* CARD 3: COMPLETED SESSIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Impact Record
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-heading mt-1 flex items-baseline gap-2">
                <span>{teacherProfile?.completedSessions ?? 0}</span>
                <span className="text-sm font-semibold text-blue-600">Completed Sessions</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Over 69 hours of verified 1-on-1 peer teaching delivered with zero unexcused cancellations.
          </p>

          <button
            onClick={() => setActiveView('sessions')}
            className="w-full py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1"
          >
            <span>VIEW SESSION LOGS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Grid: KNOWLEDGE I SHARE & TODAY'S SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: KNOWLEDGE I SHARE (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Knowledge I Share
              </h2>
              <p className="text-xs text-slate-500">Skills you are verified to mentor on LearnX</p>
            </div>
            <button
              id="btn-add-new-skill"
              onClick={() => setIsAddingSkill(!isAddingSkill)}
              className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD NEW SKILL</span>
            </button>
          </div>

          {/* Add skill input form */}
          {isAddingSkill && (
            <form onSubmit={handleAddSkill} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Enter Skill Name to Share:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="e.g. Data Science, Public Speaking"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          {/* Skill List */}
          <div className="space-y-2.5">
            {sharedSkills.map((skill) => (
              <div
                key={skill}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{skill}</h4>
                    <span className="text-[10px] text-teal-700 font-medium">
                      Status: Active Mentoring
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: TODAY'S SESSIONS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Today's Sessions
              </h2>
              <p className="text-xs text-slate-500">Upcoming 1-on-1 peer teaching appointments</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              {todaysSessions.length} Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {todaysSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:border-teal-300 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={session.learnerAvatar}
                      alt={session.learnerName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-heading">
                        {session.topic}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Learner: <strong className="text-slate-700">{session.learnerName}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {session.time}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Reward: <strong className="text-teal-700">+1 Time Credit</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSession(session);
                      setActiveView('session-room');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Open Room</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
