import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TrainerStatus, SkillProofLevel } from '../../types';

export const TrainerAvailabilityBadge: React.FC<{
  status: TrainerStatus;
  nextTime?: string;
  className?: string;
}> = ({ status, nextTime, className = '' }) => {
  if (status === 'active') {
    return (
      <span
        id="badge-status-active"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        ACTIVE NOW
      </span>
    );
  }

  if (status === 'in-class') {
    return (
      <span
        id="badge-status-in-class"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        title={nextTime ? `Next available: ${nextTime}` : 'Currently teaching another learner'}
      >
        <Clock className="w-3 h-3 text-amber-600" />
        IN CLASS {nextTime ? `• ${nextTime}` : ''}
      </span>
    );
  }

  return (
    <span
      id="badge-status-inactive"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-slate-400" />
      INACTIVE
    </span>
  );
};

export const TrustScoreBadge: React.FC<{ score: number; showLabel?: boolean }> = ({
  score,
  showLabel = true
}) => {
  return (
    <div id="badge-trust-score" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
      {showLabel && <span className="text-teal-900 font-medium">Trust:</span>}
      <span className="font-bold text-teal-700">{score}/100</span>
    </div>
  );
};

export const ReliabilityBadge: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div id="badge-reliability-score" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
      <span className="text-blue-900 font-medium">Reliability:</span>
      <span className="font-bold text-blue-700">{score}%</span>
    </div>
  );
};

export const SkillProofBadge: React.FC<{ level: SkillProofLevel }> = ({ level }) => {
  switch (level) {
    case 'institution-verified':
      return (
        <span
          id="badge-proof-institution"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
          title="Verified through accredited partner evaluation"
        >
          <ShieldCheck className="w-3 h-3 text-indigo-600" />
          Institution Verified
        </span>
      );
    case 'community-verified':
      return (
        <span
          id="badge-proof-community"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
          title="Verified by 10+ peer learners in one-to-one sessions"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Community Verified
        </span>
      );
    case 'ai-assessed':
      return (
        <span
          id="badge-proof-ai"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200"
          title="Validated via LearnX AI skill assessment quiz"
        >
          <CheckCircle2 className="w-3 h-3 text-teal-600" />
          AI Assessed
        </span>
      );
    case 'self-claimed':
    default:
      return (
        <span
          id="badge-proof-self"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-normal bg-slate-100 text-slate-600 border border-slate-200"
          title="Self-reported knowledge level"
        >
          <AlertCircle className="w-3 h-3 text-slate-400" />
          Self Claimed
        </span>
      );
  }
};
