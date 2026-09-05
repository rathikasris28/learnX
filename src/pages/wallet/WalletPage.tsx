import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';

export const WalletPage: React.FC = () => {
  const { currentUser, walletTransactions, setActiveView } = useApp();

  const balance = currentUser?.timeCredits ?? 8;
  const totalEarned = currentUser?.totalEarnedCredits ?? 8;
  const totalUsed = currentUser?.totalUsedCredits ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
          Participation Ledger
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
          Time Credit Wallet & Activity Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Monitor your non-monetary participation balance, earned session credits, and audit ledger.
        </p>
      </div>

      {/* Mandatory Prominent Non-Monetary Declaration Banner */}
      <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/90 p-6 sm:p-7 space-y-3 shadow-sm">
        <div className="flex items-start gap-3.5">
          <ShieldAlert className="w-7 h-7 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-extrabold text-amber-950 font-heading uppercase tracking-wide">
              TIME CREDITS ARE NOT MONEY & HAVE NO CASH VALUE
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Time Credits are non-monetary participation units designed exclusively to facilitate fair peer learning exchange within LearnX.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-semibold text-amber-950">
              <div className="flex items-center gap-1.5">
                <span className="text-red-600 font-bold">✕</span>
                <span>Cannot be withdrawn to bank accounts or UPI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-red-600 font-bold">✕</span>
                <span>Cannot be converted to currency or crypto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-red-600 font-bold">✕</span>
                <span>Cannot be sold, bought, or traded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-red-600 font-bold">✕</span>
                <span>Cannot be treated as salary or freelance fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CURRENT BALANCE */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 blur-2xl rounded-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
                Current Available Balance
              </span>
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold font-heading mt-3 tracking-tight">
              {balance}{' '}
              <span className="text-base font-normal text-slate-400">Credits</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Eligible to exchange for {balance} one-on-one 45-minute peer learning sessions.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Platform Status: <strong>Verified</strong></span>
            <span className="text-teal-400 font-medium">1 Session = 1 Credit</span>
          </div>
        </div>

        {/* TOTAL EARNED */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lifetime Earned
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 font-heading mt-2">
              +{totalEarned} Credits
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Accumulated through the +5 starter grant and verified knowledge sharing.
            </p>
          </div>

          <button
            onClick={() => setActiveView('learn')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Earn More by Mentoring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TOTAL USED */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lifetime Exchanged
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 font-heading mt-2">
              -{totalUsed} Credits
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Invested into verified 1-on-1 sessions to acquire new technical and life skills.
            </p>
          </div>

          <button
            onClick={() => setActiveView('my-learning')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Review Learning Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Transaction Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Immutable log of Time Credit grants, exchanges, and peer session settlement.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            {walletTransactions.length} Record(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Transaction Description</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(walletTransactions || []).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{tx.description}</span>
                    {tx.sessionId && (
                      <span className="text-[10px] text-slate-400">Ref: {tx.sessionId}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="capitalize font-semibold text-slate-700">
                      {tx.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`font-extrabold text-sm ${
                        tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to Earn More Time Credits Guide */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl border border-teal-200/80 p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            How to Earn More Time Credits on LearnX
          </h3>
          <p className="text-xs text-slate-600">
            Participation is reciprocal. As you grow your knowledge, give back to fellow learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-teal-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="font-bold text-slate-900 text-sm font-heading">
              Share Your Knowledge
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mentor a peer in a technical or non-technical skill you know. Earn +1 Credit per verified 45-minute session.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-teal-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="font-bold text-slate-900 text-sm font-heading">
              Skill Assessments & Quizzes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete module capstones and interactive quizzes to earn milestone bonuses and SkillProof badges.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-teal-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="font-bold text-slate-900 text-sm font-heading">
              High Reliability Rewards
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintain a 95%+ attendance score with zero unexcused cancellations to unlock monthly community grants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
