import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Sparkles, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Trainer } from '../../types';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice } from '../common/TimeCreditNotice';
import { bookSessionWithApi, listSessionsWithApi } from '../../services/apiClient';

export const ScheduleSessionModal: React.FC<{
  trainer?: Trainer;
  isOpen?: boolean;
  onClose?: () => void;
}> = (props) => {
  const {
    currentUser,
    bookSession,
    selectedTrainer,
    trainers,
    setSessions,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    setCurrentUser,
    showToast
  } = useApp();

  const trainer = props.trainer || selectedTrainer || trainers?.[0];
  const isOpen = props.isOpen !== undefined ? props.isOpen : isScheduleModalOpen;
  const handleClose = props.onClose || (() => setIsScheduleModalOpen(false));

  const [date, setDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(() => {
    return trainer?.availabilitySlots?.find(s => s.status === 'available')?.time || '6:00 PM';
  });
  const [topic, setTopic] = useState(() => {
    const firstSkill = trainer?.skills?.[0]?.name || 'Python';
    return `${firstSkill} 1-on-1 Practice`;
  });
  const [learningGoal, setLearningGoal] = useState(
    'Clarify fundamental concepts, review code syntax, and work through practical exercises.'
  );
  const [duration, setDuration] = useState('45 mins');

  // Keep state in sync when trainer changes or modal opens
  useEffect(() => {
    if (trainer) {
      const avail = trainer.availabilitySlots?.find(s => s.status === 'available')?.time;
      if (avail) {
        setSelectedSlot(avail);
      }
      const firstSkill = trainer.skills?.[0]?.name || 'Python';
      setTopic(`${firstSkill} 1-on-1 Practice`);
    }
  }, [trainer?.id, isOpen]);

  if (!isOpen || !trainer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasBackendTrainer = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trainer.id);
    const hasBackendSession = Boolean(localStorage.getItem('learnx_access_token')) && hasBackendTrainer;

    if (hasBackendSession) {
      const dayOffset = date === 'Tomorrow' ? 1 : date === 'In 2 Days' ? 2 : 0;
      const start = new Date();
      start.setDate(start.getDate() + dayOffset);
      const [, hourText, minuteText, meridiem] = selectedSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i) || [];
      if (!hourText || !minuteText || !meridiem) {
        showToast('Please choose a valid time slot.', 'error');
        return;
      }
      const hours = Number(hourText);
      const minutes = Number(minuteText);
      const normalizedHours = (hours % 12) + (meridiem.toUpperCase() === 'PM' ? 12 : 0);
      start.setHours(normalizedHours, minutes, 0, 0);
      const durationMinutes = Number.parseInt(duration, 10) || 45;
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
      try {
        await bookSessionWithApi({
          trainerId: trainer.id,
          skill: trainer.skills?.[0]?.name || 'Python',
          topic,
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
          learningGoal
        });
        setSessions(await listSessionsWithApi());
        setCurrentUser((user) => user ? { ...user, timeCredits: Math.max(0, user.timeCredits - 1), totalUsedCredits: user.totalUsedCredits + 1 } : user);
        showToast('Session booked and Time Credit secured.', 'success');
        handleClose();
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to book this session.', 'error');
      }
      return;
    }

    const success = bookSession({
      skillTitle: trainer.skills?.[0]?.name || 'Python',
      topic,
      trainerId: trainer.id,
      trainerName: trainer.name,
      trainerAvatar: trainer.avatar,
      date,
      time: selectedSlot,
      duration,
      creditsCost: 1,
      learningGoal
    });

    if (success) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="w-12 h-12 rounded-xl object-cover border border-teal-300"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Schedule Session with {trainer.name}
              </h3>
              <p className="text-xs text-slate-500">{trainer.title}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Credit Cost Box */}
          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-xs font-bold text-teal-900">Exchange Cost: 1 Time Credit</p>
                <p className="text-[11px] text-teal-700">Standard 45-minute 1-to-1 session</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Your Balance: </span>
              <strong className="text-xs text-slate-900 font-bold">
                {currentUser ? `${currentUser.timeCredits} Credits` : '0 Credits'}
              </strong>
            </div>
          </div>

          {/* Date selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Select Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Today', 'Tomorrow', 'In 2 Days'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDate(d)}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    date === d
                      ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Available Time Slots
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(trainer.availabilitySlots || []).map((slot) => {
                const isAvailable = slot.status === 'available';
                const isSelected = selectedSlot === slot.time && isAvailable;

                return (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2 px-2.5 text-xs rounded-lg border flex flex-col items-center justify-center gap-0.5 transition ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                        : isAvailable
                        ? 'bg-emerald-50/60 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className="font-semibold">{slot.time}</span>
                    <span className="text-[10px] uppercase font-bold">
                      {slot.status === 'in-class'
                        ? 'In Class'
                        : slot.status === 'booked'
                        ? 'Booked'
                        : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Duration
            </label>
            <div className="flex gap-2">
              {['30 mins', '45 mins', '60 mins'].map((dur) => (
                <button
                  type="button"
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border font-medium ${
                    duration === dur
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Session Topic
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Python Functions & Scope Deep Dive"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Learning Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              What do you want to accomplish in this session?
            </label>
            <textarea
              rows={2}
              required
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="Describe your learning goal so the knowledge sharer can prepare..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Notice */}
          <TimeCreditNotice compact />

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM BOOKING (1 Credit)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
