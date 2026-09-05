import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  Award,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Video
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SkillProofBadge } from '../../components/common/BadgeComponents';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';

export const MyLearningPage: React.FC = () => {
  const { learningPlan, sessions, setSelectedSession, setActiveView, showToast } = useApp();

  // Interactive Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestions = [
    {
      question: 'In Python, what keyword is used to define a reusable function?',
      options: ['func', 'def', 'function', 'define'],
      correct: 1
    },
    {
      question: 'Which data structure is ordered, mutable, and enclosed in square brackets [ ]?',
      options: ['Tuple', 'Dictionary', 'List', 'Set'],
      correct: 2
    },
    {
      question: 'What is the non-monetary unit used to exchange peer learning on LearnX?',
      options: ['Crypto Token', 'Time Credit (No Cash Value)', 'Cash Points', 'Freelance Dollars'],
      correct: 1
    }
  ];

  const handleSelectOption = (optIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIdx] = optIdx;
    setSelectedAnswers(updated);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizSubmitted(true);
      // Calculate score
      let correctCount = 0;
      quizQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) correctCount++;
      });

      if (correctCount === quizQuestions.length) {
        confetti({ particleCount: 60, spread: 60 });
        showToast('Outstanding! 100% Score. Skill verified!', 'success');
      } else {
        showToast(`Quiz completed: ${correctCount}/${quizQuestions.length} correct.`, 'info');
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers([]);
    setQuizSubmitted(false);
  };

  const calculateScore = () => {
    let count = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) count++;
    });
    return count;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
            Structured Learning Roadmap
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
            My Learning Progress & Skill Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your week-by-week goals, peer session logs, and take verified SkillProof assessments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              const nextSession = sessions.find(session => session.status === 'scheduled');
              if (nextSession) {
                setSelectedSession(nextSession);
                setActiveView('session-room');
              } else {
                setActiveView('sessions');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition"
            title="Launch live face-to-face video & frontend code studio"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <Video className="w-4 h-4 text-slate-950" />
            <span>Enter Live Video Room</span>
          </button>
          
          <button
            onClick={() => setActiveView('learn')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
          >
            <span>Schedule Next Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <TimeCreditNotice />

      {/* 4-Week Structured Learning Plan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-teal-600 tracking-wider">
              Current Active Track
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-heading mt-0.5">
              {learningPlan.trackTitle || learningPlan.skillName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Overall Track Completion:</span>
            <div className="flex items-center gap-2">
              <div className="w-36 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                  style={{ width: `${learningPlan.overallProgress}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-teal-700 font-mono">
                {learningPlan.overallProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Weeks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {((learningPlan?.weeks && learningPlan.weeks.length > 0)
            ? learningPlan.weeks
            : (learningPlan?.modules || []).map((mod, idx) => {
                const allCompleted = (mod.topics || []).length > 0 && mod.topics.every((t) => t.completed);
                const someCompleted = (mod.topics || []).some((t) => t.completed);
                return {
                  weekNumber: idx + 1,
                  title: mod.title,
                  description: `Structured curriculum topics for ${mod.title}`,
                  status: (allCompleted ? 'completed' : someCompleted ? 'in-progress' : 'upcoming') as 'completed' | 'in-progress' | 'upcoming',
                  topics: (mod.topics || []).map((t) => (typeof t === 'string' ? t : t.title))
                };
              })
          ).map((wk) => {
            const isCompleted = wk.status === 'completed';
            const isInProgress = wk.status === 'in-progress';
            return (
              <div
                key={wk.weekNumber}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                  isInProgress
                    ? 'border-teal-500 bg-teal-50/30 shadow-md shadow-teal-500/5'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-slate-50/60 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Week 0{wk.weekNumber}
                    </span>
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Upcoming
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm font-heading">
                    {wk.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {wk.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <p className="font-semibold text-slate-700 text-[11px]">Topics:</p>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {(wk.topics || []).map((t) => {
                      const topicLabel = typeof t === 'string' ? t : t.title;
                      return (
                        <li key={topicLabel} className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-teal-500' : 'bg-slate-300'}`} />
                          <span>{topicLabel}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Practice Quiz Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Interactive SkillProof Quiz Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify your understanding of Week 3 topics and platform rules to earn verified skill badges.
            </p>
          </div>

          {!quizActive && (
            <button
              onClick={() => {
                setQuizActive(true);
                handleRestartQuiz();
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md self-start sm:self-auto flex items-center gap-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              <span>START WEEK 3 QUIZ</span>
            </button>
          )}
        </div>

        {quizActive && !quizSubmitted && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="text-teal-700 font-bold">
                Question {currentQuestionIdx + 1} of {quizQuestions.length}
              </span>
              <span>Topic: Python & Platform Rules</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
              {quizQuestions[currentQuestionIdx].question}
            </h3>

            <div className="space-y-2">
              {quizQuestions[currentQuestionIdx].options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-3 rounded-xl border text-xs sm:text-sm text-left font-medium transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                disabled={selectedAnswers[currentQuestionIdx] === undefined}
                onClick={handleNextQuestion}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedAnswers[currentQuestionIdx] !== undefined
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {currentQuestionIdx < quizQuestions.length - 1 ? 'Next Question' : 'Submit Answers'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {quizActive && quizSubmitted && (
          <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
              {calculateScore() === quizQuestions.length ? '🎉' : '📝'}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Quiz Result: {calculateScore()} / {quizQuestions.length} Correct
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                {calculateScore() === quizQuestions.length
                  ? 'Congratulations! You demonstrated full mastery of functions and verified platform principles. Your SkillProof badge is updated.'
                  : 'Good effort! Review the topics with a peer mentor and try again to unlock full verification.'}
              </p>
            </div>

            {calculateScore() === quizQuestions.length && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-teal-300 shadow-xs">
                <Award className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-teal-900">
                  SkillProof Verified: Python Functions Level 2
                </span>
              </div>
            )}

            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={handleRestartQuiz}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={() => setQuizActive(false)}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Past Peer Sessions History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Peer Learning History & Confirmation Logs
            </h2>
            <p className="text-xs text-slate-500">
              Completed 1-on-1 sessions verified via Dual Confirmation.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total Completed: <strong>{sessions.filter(s => s.status === 'completed').length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-3">Session Topic</th>
                <th className="py-3 px-3">Trainer / Mentor</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Time Credits</th>
                <th className="py-3 px-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{s.topic}</span>
                    <span className="text-[10px] text-slate-500">{s.skillTitle}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={s.trainerAvatar}
                        alt={s.trainerName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-800">{s.trainerName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{s.date} • {s.time}</td>
                  <td className="py-3 px-3 text-slate-600">{s.duration}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-teal-700">
                      -{s.creditsCost} Credit
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {s.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Dual Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <Clock className="w-3 h-3" />
                        Scheduled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
