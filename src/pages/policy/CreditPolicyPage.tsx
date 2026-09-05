import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Lock,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FreelanceWarningCard } from '../../components/common/TimeCreditNotice';

export const CreditPolicyPage: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => setActiveView('landing')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
          Platform Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
          LearnX Time Credit Policy & Community Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official guidelines governing participation units, session standards, and non-monetary ethics.
        </p>
      </div>

      {/* Prominent Disclaimer Card */}
      <FreelanceWarningCard />

      {/* Sections breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
        
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-extrabold">
              1
            </span>
            <span>Non-Monetary Fundamental Principle</span>
          </h2>
          <p>
            LearnX was created on the core human ethos: <em>"Give What You Know. Learn What You Need. Grow Together."</em> It is strictly a peer-to-peer knowledge and skills exchange platform. It is <strong>not</strong> a freelance job marketplace, contract work board, or payment service.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-extrabold">
              2
            </span>
            <span>Absolute Cash Value Prohibition</span>
          </h2>
          <p>
            Time Credits represent time and participatory learning equity only. They possess <strong>no financial or cash equivalence</strong> whatsoever.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li>Users cannot cash out, withdraw, or convert Time Credits to fiat money or crypto.</li>
            <li>No user may request, accept, or offer external cash, UPI, PayPal, or bank transfers.</li>
            <li>Any attempt to sell Time Credits will result in immediate permanent account termination.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-extrabold">
              3
            </span>
            <span>Earning & Allocation Standards</span>
          </h2>
          <p>
            Time Credits are allocated through structured system events:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-800 block text-xs">Learner Starter Balance</span>
              <p className="text-[11px] text-slate-600 mt-1">
                Every newly registered Learner receives <strong>+5 Starter Time Credits</strong> to explore sessions.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-blue-800 block text-xs">Knowledge Sharer Balance</span>
              <p className="text-[11px] text-slate-600 mt-1">
                Sharers start with <strong>0 Credits</strong> and earn <strong>+1 Credit</strong> per verified session conducted.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-extrabold">
              4
            </span>
            <span>Dual-Confirmation Verification</span>
          </h2>
          <p>
            To prevent fraud and maintain the integrity of our community, session completion requires <strong>Dual Confirmation</strong>. Both the Learner and the Knowledge Sharer must submit end-of-session verification before Time Credits are released to the teacher's wallet.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-extrabold">
              5
            </span>
            <span>Safety, Respect & Zero Harassment</span>
          </h2>
          <p>
            All virtual session rooms are monitored with automated safety screening. Users are expected to maintain professional, polite, and constructive conduct. Any discriminatory behavior, hate speech, or harassment will result in prompt account suspension.
          </p>
        </div>

      </div>
    </div>
  );
};
