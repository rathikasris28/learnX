import React from 'react';
import { ShieldCheck, Info, Sparkles, BookOpen, GraduationCap, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 pb-24 xl:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Core Non-Monetary Trust Disclaimer Box */}
        <div className="rounded-2xl border border-teal-500/30 bg-slate-800/60 p-5 sm:p-6 backdrop-blur">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                <ShieldCheck className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base flex items-center gap-2 font-heading">
                  LearnX Official Platform Principle
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                    Non-Monetary
                  </span>
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed max-w-3xl">
                  <strong>LearnX is NOT a freelancing platform, job marketplace, or salary platform.</strong> The primary value exchanged is learning time and knowledge. Time Credits are internal non-monetary participation units and have <strong>NO CASH VALUE</strong>. They cannot be withdrawn, sold, or converted into currency.
                </p>
              </div>
            </div>
            <button
              id="footer-read-policy-btn"
              onClick={() => setActiveView('policy')}
              className="px-4 py-2 text-xs font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg transition-colors whitespace-nowrap"
            >
              Read Full Credit Policy →
            </button>
          </div>
        </div>

        {/* Brand & Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-700 flex items-center justify-center text-white font-extrabold text-base shadow-md overflow-hidden">
                <img
                  src="/logo.png"
                  alt="LearnX Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-bold text-white font-heading">
                Learn<span className="text-teal-400">X</span>
              </span>
            </div>
            <p className="text-teal-300 font-semibold text-xs tracking-wide">
              Exchange. Learn. Grow.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Give What You Know. Learn What You Need. Grow Together.
            </p>
            <p className="text-[11px] text-slate-500 italic">
              "Your Knowledge. Your Time. Your Growth."
            </p>
          </div>

          {/* Col 2: Learning & Sharing */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Knowledge Exchange
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('learn')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Find a Knowledge Sharer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('teach')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Share Your Knowledge
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('discover')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Explore Technical Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('discover')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Explore Non-Technical Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('assistant')}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  AI Learning Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs & Integrity */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Trust & Growth
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('policy')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Time Credit Policy & Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('courses')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Partner Courses & Webinars
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('achievements')}
                  className="hover:text-teal-300 transition-colors"
                >
                  SkillProof & Achievements
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('wallet')}
                  className="hover:text-teal-300 transition-colors"
                >
                  Non-Monetary Time Wallet
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin-dashboard')}
                  className="hover:text-purple-400 transition-colors text-slate-400"
                >
                  Admin Analytics Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Starter Credits & Safety */}
          <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider">
              Starting Participation
            </h5>
            <div className="text-xs space-y-1 text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                <span>Learner Starter:</span>
                <span className="font-bold text-teal-400">+5 Time Credits</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Teacher Starter:</span>
                <span className="font-bold text-slate-400">0 Time Credits</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Earn credits through verified peer sessions. Spend credits to unlock 1-on-1 sessions and partner certifications.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 LearnX Platform. All Rights Reserved. Built for peer-to-peer knowledge sharing.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('policy')} className="hover:text-slate-300">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => setActiveView('policy')} className="hover:text-slate-300">
              Trust & Safety
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
