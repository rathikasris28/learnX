import React from 'react';
import { Sparkles, Info, ShieldAlert } from 'lucide-react';

export const TimeCreditNotice: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = ''
}) => {
  if (compact) {
    return (
      <div
        id="time-credit-notice-compact"
        className={`flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/80 ${className}`}
      >
        <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        <span>Time Credits are non-monetary and have <strong>no cash value</strong>.</span>
      </div>
    );
  }

  return (
    <div
      id="time-credit-notice-banner"
      className={`rounded-xl border border-teal-200/70 bg-gradient-to-r from-teal-50/70 via-blue-50/50 to-slate-50 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-700 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-teal-600" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 flex items-center gap-2">
            Non-Monetary Knowledge Exchange Unit
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              Policy Verified
            </span>
          </p>
          <p className="text-slate-600 leading-relaxed text-xs">
            Time Credits help users exchange learning time and knowledge. They are <strong>not money</strong>, cannot be converted to cash, withdrawn, or treated as salary or freelance income.
          </p>
        </div>
      </div>
    </div>
  );
};

export const FreelanceWarningCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      id="freelance-warning-card"
      className={`rounded-xl border-2 border-amber-200 bg-amber-50/80 p-4 text-amber-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/15 text-amber-800 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-amber-950 uppercase tracking-wide">
            LearnX is NOT a Freelancing Platform
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            LearnX is exclusively an educational peer knowledge exchange. Time Credits have <strong>NO CASH VALUE</strong> and cannot be withdrawn, transferred outside the platform, or sold.
          </p>
        </div>
      </div>
    </div>
  );
};
