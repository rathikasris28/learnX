import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Search,
  BookOpen,
  GraduationCap,
  Award,
  Zap,
  Bot,
  BrainCircuit,
  MessageSquare,
  Compass,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice, FreelanceWarningCard } from '../../components/common/TimeCreditNotice';

export const LandingPage: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="landing-experience">
      <div className="landing-slides-track">
      {/* Hero Section */}
      <section className="landing-slide relative overflow-hidden pt-8 sm:pt-12 pb-12 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        {/* Abstract CSS AI Glow Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Official Brand Emblem & Logo */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-2xl shadow-teal-500/20 border-2 border-slate-700/60 transition-transform hover:scale-105 overflow-hidden">
                <img
                  src="https://cdn.phototourl.com/free/2026-09-05-64dcc94e-b14d-45c2-b144-78f775597507.jpg"
                  alt="LearnX Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-inner animate-in fade-in duration-300">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span><strong>Exchange. Learn. Grow.</strong></span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              Share What You Know.{' '}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Learn What You Need.
              </span>
            </h1>

            {/* Brand Message & Supporting text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Give What You Know. Learn What You Need. Grow Together. Learn technical and non-technical knowledge from real people in 1-on-1 sessions, earn Time Credits through verified participation, and accelerate your growth.
            </p>

            {/* Anti-Monetary Quick Pill */}
            <div className="inline-block bg-slate-800/70 border border-slate-700 px-4 py-1.5 rounded-full text-xs text-slate-400">
              <span className="text-teal-400 font-bold">Time Credits have NO cash value</span> • Non-monetary peer learning exchange
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                id="hero-start-learning-btn"
                onClick={() => setActiveView('register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 hover:from-teal-300 hover:to-cyan-200 shadow-xl shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
              >
                <span>Start Learning (+5 Starter Credits)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-share-knowledge-btn"
                onClick={() => setActiveView('register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span>Share Knowledge (0 Credits Starter)</span>
              </button>
            </div>

          </div>

          {/* Original CSS Abstract Learning Ecosystem Visual */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="text-center mb-6">
                <span className="text-[11px] uppercase tracking-widest font-bold text-teal-400">
                  The Complete LearnX Ecosystem Flow
                </span>
                <p className="text-sm font-semibold text-white mt-1">
                  People learn from people. AI finds the ideal match. Time Credits sustain the loop.
                </p>
              </div>

              {/* Connected Flow Diagram: Learner -> AI Match -> Teacher -> 1-on-1 -> Knowledge Sharing -> Time Credits -> Growth */}
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center relative">
                {[
                  { step: 'Learner', desc: '+5 Starter Credits', icon: GraduationCap, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
                  { step: 'AI Match', desc: '96% Match Algorithm', icon: Bot, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
                  { step: 'Teacher', desc: 'Verified Knowledge', icon: Users, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
                  { step: '1-to-1 Live', desc: 'Video, Notes & Code', icon: MessageSquare, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
                  { step: 'Knowledge Shared', desc: 'Peer Assessment', icon: BookOpen, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
                  { step: 'Time Credits', desc: '+1 Earned (No Cash)', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
                  { step: 'Continuous Growth', desc: 'Verified SkillProof', icon: Award, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex flex-col items-center p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 border ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white font-heading">{item.step}</span>
                      <span className="text-[10px] text-slate-400 mt-1 leading-tight">{item.desc}</span>
                      {idx < 6 && (
                        <span className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 text-xs">
                          →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Dual Confirmation Verification required after each session
                </span>
                <span className="text-teal-400 font-medium">
                  Cycle: LEARN → SHARE → EARN TIME CREDITS → LEARN AGAIN → GROW
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How LearnX Works Section */}
      <section className="landing-slide max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Interactive Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
            How LearnX Works
          </h2>
          <p className="text-sm text-slate-600">
            A seamless, safe, and verifiable peer-to-peer knowledge exchange powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: '1',
              title: 'Discover & AI Match',
              desc: 'Browse technical and non-technical skills. Our AI pairs you with peers based on language, availability, and teaching style.',
              icon: BrainCircuit,
              badge: 'Smart Matching'
            },
            {
              num: '2',
              title: '1-to-1 Interactive Sessions',
              desc: 'Join private virtual rooms equipped with live video, collaborative scratchpads, interactive whiteboards, and learning goal tracking.',
              icon: MessageSquare,
              badge: '45-Min Rooms'
            },
            {
              num: '3',
              title: 'Earn & Use Time Credits',
              desc: 'Newly joined learners receive 5 starter credits. Share your own knowledge to earn more credits for ongoing learning opportunities.',
              icon: Sparkles,
              badge: 'Non-Monetary'
            },
            {
              num: '4',
              title: 'Certify & Grow',
              desc: 'Advance along structured paths, take skill quizzes, earn achievements, and access partner courses with verifiable certificates.',
              icon: Award,
              badge: 'SkillProof'
            }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-extrabold text-lg border border-teal-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-400 font-mono">
                  Step 0{card.num}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mandatory Platform Disclaimer Callout Section */}
      <section className="landing-slide max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <FreelanceWarningCard />
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-slide max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
              Ready to Exchange Knowledge & Grow?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Join thousands of learners and knowledge sharers. Register today to receive 5 starter Time Credits and begin your personalized learning journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 shadow-lg text-sm transition"
              >
                Register as Learner (+5 Starter Credits)
              </button>
              <button
                onClick={() => setActiveView('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition"
              >
                Register as Knowledge Sharer
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>

    </div>
  );
};
