import React, { useState } from 'react';
import {
  Award,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';

export const CommunityPage: React.FC = () => {
  const { courses: appCourses, partnerCourses, setSelectedCourse, setActiveView, showToast } = useApp();
  const courses = appCourses || partnerCourses || [];


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
          Peer Ecosystem
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
          Community & Partner Learning Programs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Connect with fellow peers, join discussion circles, and access accredited partner courses with certificates.
        </p>
      </div>

      <TimeCreditNotice />

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-teal-700">
        <Award className="w-4 h-4" /> Accredited Partner Courses ({courses.length})
      </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              Complete recognized partner tracks to earn verified digital credentials and industry skill certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src="/logo.png"
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                      {course.partnerOrganization}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="capitalize text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <span>•</span>
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.mode}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base font-heading">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {course.certificateEligible && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Includes Verifiable Certificate</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveView('course-detail');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Course</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};
