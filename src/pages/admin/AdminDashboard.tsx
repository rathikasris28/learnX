import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Filter,
  Eye,
  Lock,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();

  const [reports, setReports] = useState([
    {
      id: 'rep_001',
      reportedName: 'Ramesh K.',
      reportedRole: 'Teacher',
      reporterName: 'Divya M.',
      reason: 'Demanded cash payment outside platform for extra class',
      severity: 'High',
      date: 'Sep 04, 2026',
      status: 'pending'
    },
    {
      id: 'rep_002',
      reportedName: 'Vikram S.',
      reportedRole: 'Learner',
      reporterName: 'Priya Raman',
      reason: 'Repeated unexcused late arrival to 1-on-1 session',
      severity: 'Medium',
      date: 'Sep 03, 2026',
      status: 'resolved'
    }
  ]);

  const [auditLogs] = useState([
    {
      id: 'aud_1',
      event: 'Anti-Monetary Guard Triggered: Flagged attempt to share bank details in chat',
      user: 'Anonymous Peer',
      actionTaken: 'Warning message sent & chat blocked',
      time: '1 hour ago'
    },
    {
      id: 'aud_2',
      event: 'Dual Confirmation Completed: Session #ses_01 confirmed by both Aarav & Priya',
      user: 'Aarav & Priya',
      actionTaken: '+1 Time Credit safely settled to Trainer balance',
      time: '3 hours ago'
    }
  ]);

  const handleAction = (reportId: string, actionType: 'warn' | 'suspend' | 'dismiss') => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    if (actionType === 'warn') {
      showToast('Official platform warning issued to user.', 'warning');
    } else if (actionType === 'suspend') {
      showToast('User account suspended for non-monetary policy violation.', 'danger');
    } else {
      showToast('Report reviewed and dismissed.', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Trust, Safety & Governance Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 uppercase tracking-wide">
              Admin Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enforce community safety, investigate non-monetary policy adherence, and verify SkillProof audits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Integrity Guard: Active</span>
        </div>
      </div>

      <TimeCreditNotice />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Verified Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">
            3,842
          </div>
          <p className="text-[11px] text-slate-400">2,410 Learners • 1,432 Sharers</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Live 1-on-1 Rooms</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-700 font-heading">
            42 Active
          </div>
          <p className="text-[11px] text-slate-400">Average duration: 43.8 mins</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Time Credits In Loop</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 font-heading">
            19,420
          </div>
          <p className="text-[11px] text-slate-400">Strictly non-monetary participation</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Open Flagged Reports</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-heading">
            {reports.filter(r => r.status === 'pending').length} Pending
          </div>
          <p className="text-[11px] text-slate-400">Requires manual review</p>
        </div>
      </div>

      {/* Flagged Trust & Safety Reports Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Safety & Policy Reports Queue
            </h2>
            <p className="text-xs text-slate-500">
              Users reported for soliciting cash, verbal disrespect, or attendance fraud.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-3">Reported User</th>
                <th className="py-3 px-3">Reporter</th>
                <th className="py-3 px-3">Allegation / Reason</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{r.reportedName}</span>
                    <span className="text-[10px] text-slate-500">{r.reportedRole}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">{r.reporterName}</td>
                  <td className="py-3.5 px-3 text-slate-800 max-w-xs">{r.reason}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.severity === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{r.date}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        r.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {r.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAction(r.id, 'warn')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[10px]"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'suspend')}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px]"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'dismiss')}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded text-[10px]"
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Integrity Auditing Log */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-heading">
          Real-Time Integrity & Policy Audit Logs
        </h2>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">{log.event}</span>
                <span className="text-slate-500 text-[11px]">
                  Target: {log.user} • Action: <strong>{log.actionTaken}</strong>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
