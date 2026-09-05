import React from 'react';
import { ArrowLeft, Award, Calendar, CheckCircle2, Clock, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';

export const CourseDetailPage: React.FC = () => {
  const { selectedCourse, setActiveView, registerForCourse } = useApp();

  if (!selectedCourse) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Course unavailable</h1>
        <button onClick={() => setActiveView('courses')} className="mt-4 text-teal-700 font-bold">Back to courses</button>
      </div>
    );
  }

  const handleRegister = () => {
    if (selectedCourse.isRegistered || registerForCourse(selectedCourse.id)) {
      setActiveView('courses');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button onClick={() => setActiveView('courses')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-teal-700">
        <ArrowLeft className="w-4 h-4" /> Back to courses
      </button>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-teal-900 p-7 sm:p-10 text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300">{selectedCourse.category}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mt-2">{selectedCourse.title}</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">Delivered by {selectedCourse.partnerOrganization}. {selectedCourse.description}</p>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <TimeCreditNotice />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="p-4 rounded-2xl bg-slate-50"><Clock className="w-4 h-4 text-teal-600" /><strong className="block mt-2">{selectedCourse.duration}</strong><span className="text-slate-500">Duration</span></div>
            <div className="p-4 rounded-2xl bg-slate-50"><Video className="w-4 h-4 text-teal-600" /><strong className="block mt-2">{selectedCourse.mode}</strong><span className="text-slate-500">Format</span></div>
            <div className="p-4 rounded-2xl bg-slate-50"><Calendar className="w-4 h-4 text-teal-600" /><strong className="block mt-2">{selectedCourse.startDate}</strong><span className="text-slate-500">Starts</span></div>
            <div className="p-4 rounded-2xl bg-slate-50"><Award className="w-4 h-4 text-teal-600" /><strong className="block mt-2">{selectedCourse.sessionsCount} sessions</strong><span className="text-slate-500">Schedule</span></div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <div>
              <p className="text-sm font-bold text-slate-900">Participation requirement</p>
              <p className="text-sm text-slate-500 mt-1">{selectedCourse.timeCreditRequirement} Time Credit{selectedCourse.timeCreditRequirement === 1 ? '' : 's'} · no cash value</p>
              {selectedCourse.certificateEligible && <p className="text-sm text-emerald-700 font-semibold mt-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Certificate eligible</p>}
            </div>
            <button onClick={handleRegister} disabled={selectedCourse.isRegistered} className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-sm">
              {selectedCourse.isRegistered ? 'Registered' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
