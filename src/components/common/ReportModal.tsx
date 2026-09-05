import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, showToast } = useApp();
  const [reportType, setReportType] = useState('session_conduct');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isReportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      showToast('Report submitted to LearnX Trust & Safety Team for review.', 'info');
      setIsReportModalOpen(false);
      setSubmitted(false);
      setDetails('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Trust & Safety Report
              </h3>
              <p className="text-xs text-slate-500">Confidential moderation review</p>
            </div>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-slate-800">Report Received</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Our safety officers inspect all logs within 2 hours. Your identity is kept strictly confidential.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Report
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="session_conduct">Inappropriate or Disrespectful Behavior</option>
                <option value="freelance_attempt">Soliciting Money / Freelance Work (Rule Violation)</option>
                <option value="no_show">Trainer / Learner No-Show or Late Arrival</option>
                <option value="fake_skill">Falsely Claimed Skills / Incompetence</option>
                <option value="harassment">Harassment or Safety Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Explanation & Context
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide specific details about what occurred..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Note: LearnX zero-tolerance policy applies to freelance solicitation or attempts to exchange cash for Time Credits.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Submit Incident Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
