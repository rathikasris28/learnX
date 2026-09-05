import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Trainer,
  LearningSession,
  WalletTransaction,
  LearningPlan,
  PartnerCourse,
  NotificationItem,
  Achievement,
  TrainerStatus
} from '../types';
import {
  INITIAL_TRAINERS,
  INITIAL_SESSIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_LEARNING_PLAN,
  INITIAL_PARTNER_COURSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACHIEVEMENTS
} from '../data/mockData';
import { mockEmailService } from '../services/emailService';

export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'learner-dashboard'
  | 'teacher-dashboard'
  | 'admin-dashboard'
  | 'learn'
  | 'teach'
  | 'discover'
  | 'my-learning'
  | 'sessions'
  | 'session-room'
  | 'wallet'
  | 'achievements'
  | 'notifications'
  | 'profile'
  | 'policy'
  | 'trainer-profile'
  | 'courses'
  | 'course-detail'
  | 'quiz'
  | 'assistant';

interface ToastData {
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedTrainer: Trainer | null;
  setSelectedTrainer: (trainer: Trainer | null) => void;
  selectedSession: LearningSession | null;
  setSelectedSession: (session: LearningSession | null) => void;
  selectedCourse: PartnerCourse | null;
  setSelectedCourse: (course: PartnerCourse | null) => void;
  trainers: Trainer[];
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
  updateTrainerStatus: (trainerId: string, status: TrainerStatus) => void;
  sessions: LearningSession[];
  bookSession: (newSession: Partial<LearningSession>) => boolean;
  completeSession: (sessionId: string, rating: number, feedback: string) => void;
  walletTransactions: WalletTransaction[];
  addTransaction: (tx: Omit<WalletTransaction, 'id' | 'timestamp'>) => void;
  partnerCourses: PartnerCourse[];
  courses: PartnerCourse[];
  registerForCourse: (courseId: string) => boolean;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  achievements: Achievement[];
  learningPlan: LearningPlan;
  toggleTopicCompleted: (topicId: string) => void;
  logout: () => void;
  toast: ToastData | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  isMobileActionModalOpen: boolean;
  setIsMobileActionModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  isEmailVerificationModalOpen: boolean;
  setIsEmailVerificationModalOpen: (open: boolean) => void;
  verifyEmail: (code: string) => boolean;
  sendVerificationEmail: (email?: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence via localStorage for prototype
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('learnx_session_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [activeView, setActiveView] = useState<AppView>(() => {
    return currentUser ? (currentUser.role === 'teacher' ? 'teacher-dashboard' : currentUser.role === 'admin' ? 'admin-dashboard' : 'learner-dashboard') : 'landing';
  });

  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(INITIAL_TRAINERS[0]);
  const [sessions, setSessions] = useState<LearningSession[]>(INITIAL_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<LearningSession | null>(null);
  const [partnerCourses, setPartnerCourses] = useState<PartnerCourse[]>(INITIAL_PARTNER_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<PartnerCourse | null>(INITIAL_PARTNER_COURSES[0]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [learningPlan, setLearningPlan] = useState<LearningPlan>(INITIAL_LEARNING_PLAN);

  const [toast, setToast] = useState<ToastData | null>(null);
  const [isMobileActionModalOpen, setIsMobileActionModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] = useState<boolean>(false);
  const [activeVerificationCode, setActiveVerificationCode] = useState<string>('');
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<number>(0);
  const [verificationAttempts, setVerificationAttempts] = useState<number>(0);

  // Sync user state to storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('learnx_session_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('learnx_session_v2');
    }
  }, [currentUser]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const updateTrainerStatus = (trainerId: string, status: TrainerStatus) => {
    setTrainers(prev =>
      prev.map(t => (
        t.id === trainerId || t.name === currentUser?.name
          ? { ...t, status }
          : t
      ))
    );
    if (currentUser && (currentUser.id === trainerId || currentUser.name === trainers.find(t => t.id === trainerId)?.name)) {
      // also notify
      showToast(`Status updated to ${status.toUpperCase()}`, 'info');
    }
  };

  const addTransaction = (tx: Omit<WalletTransaction, 'id' | 'timestamp'>) => {
    const newTx: WalletTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      timestamp: Date.now()
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    // Update user balance
    setCurrentUser(prev => {
      if (!prev) return null;
      const newBal = prev.timeCredits + tx.amount;
      return {
        ...prev,
        timeCredits: Math.max(0, newBal),
        totalEarnedCredits: tx.amount > 0 ? prev.totalEarnedCredits + tx.amount : prev.totalEarnedCredits,
        totalUsedCredits: tx.amount < 0 ? prev.totalUsedCredits + Math.abs(tx.amount) : prev.totalUsedCredits
      };
    });
  };

  const bookSession = (newSessionData: Partial<LearningSession>): boolean => {
    if (!currentUser) {
      showToast('Please log in to schedule a session.', 'warning');
      setActiveView('login');
      return false;
    }

    const cost = newSessionData.creditsCost ?? 1;

    // Check balance
    if (currentUser.timeCredits < cost) {
      showToast(
        `Insufficient Time Credits (${currentUser.timeCredits} available, ${cost} required). Share knowledge to earn credits!`,
        'warning'
      );
      return false;
    }

    const newSession: LearningSession = {
      id: `ses_${Date.now()}`,
      skillTitle: newSessionData.skillTitle || 'Python',
      topic: newSessionData.topic || 'Peer Learning Session',
      trainerId: newSessionData.trainerId || 'tr_01',
      trainerName: newSessionData.trainerName || 'Priya Raman',
      trainerAvatar: newSessionData.trainerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerAvatar: currentUser.avatar,
      date: newSessionData.date || 'Today',
      time: newSessionData.time || '6:00 PM',
      duration: newSessionData.duration || '45 mins',
      creditsCost: cost,
      status: 'scheduled',
      learningGoal: newSessionData.learningGoal || 'Personal skill development'
    };

    setSessions(prev => [newSession, ...prev]);
    setSelectedSession(newSession);

    // Record wallet deduction
    addTransaction({
      type: 'used',
      amount: -cost,
      description: `Scheduled 1-on-1 Session: ${newSession.topic} with ${newSession.trainerName}`,
      partnerName: newSession.trainerName,
      skillName: newSession.skillTitle,
      date: 'Today'
    });

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      category: 'session_accepted',
      title: 'Session Confirmed! 📅',
      message: `Your session with ${newSession.trainerName} for ${newSession.topic} is booked for ${newSession.date} at ${newSession.time}.`,
      timestamp: 'Just now',
      read: false,
      actionView: 'sessions'
    };
    const teacherNotif: NotificationItem = {
      id: `notif_teacher_${Date.now()}`,
      category: 'session_accepted',
      title: 'New learner session request',
      message: `${newSession.learnerName} booked ${newSession.topic} for ${newSession.date} at ${newSession.time}. Join the live class from Sessions when you are ready.`,
      timestamp: 'Just now',
      read: false,
      actionView: 'sessions'
    };
    setNotifications(prev => [newNotif, teacherNotif, ...prev]);

    showToast(`Session successfully booked! 1 Time Credit deducted.`, 'success');
    return true;
  };

  const completeSession = (sessionId: string, rating: number, feedback: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'completed',
            learnerConfirmed: true,
            trainerConfirmed: true,
            ratingGiven: rating,
            feedback
          };
        }
        return s;
      })
    );

    // Find the session to reward trainer or acknowledge
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      // If current user was the teacher in this session, credit +1
      const isCurrentUserTeacher = currentUser && (
        currentUser.id === session.trainerId || currentUser.name === session.trainerName
      );
      if (isCurrentUserTeacher) {
        addTransaction({
          type: 'earned',
          amount: 1,
          description: `Verified Knowledge Sharing completed: ${session.topic} with ${session.learnerName}`,
          partnerName: session.learnerName,
          skillName: session.skillTitle,
          date: 'Today'
        });
        showToast('Session verified! You earned +1 Time Credit for sharing knowledge.', 'success');
      } else {
        showToast('Session marked as successfully completed! Thank you for exchanging knowledge.', 'success');
      }
    }
  };

  const registerForCourse = (courseId: string): boolean => {
    const course = partnerCourses.find(c => c.id === courseId);
    if (!course || !currentUser) return false;

    if (currentUser.timeCredits < course.timeCreditRequirement) {
      showToast(
        `Insufficient Time Credits. You need ${course.timeCreditRequirement} Time Credits to register.`,
        'warning'
      );
      return false;
    }

    setPartnerCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, isRegistered: true, progressPercent: 10 } : c))
    );

    addTransaction({
      type: 'used',
      amount: -course.timeCreditRequirement,
      description: `Registered for Partner Course: ${course.title} by ${course.partnerOrganization}`,
      skillName: course.title,
      date: 'Today'
    });

    showToast(`Successfully registered for ${course.title}!`, 'success');
    return true;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const toggleTopicCompleted = (topicId: string) => {
    setLearningPlan(prev => {
      let totalTopics = 0;
      let completedTopics = 0;

      const newModules = prev.modules.map(mod => {
        const newTopics = mod.topics.map(t => {
          const isTarget = t.id === topicId;
          const completed = isTarget ? !t.completed : t.completed;
          totalTopics++;
          if (completed) completedTopics++;
          return { ...t, completed };
        });
        return { ...mod, topics: newTopics };
      });

      const newProgress = Math.round((completedTopics / totalTopics) * 100);

      return {
        ...prev,
        overallProgress: newProgress,
        modules: newModules
      };
    });
    showToast('Learning plan progress updated!', 'success');
  };

  const sendVerificationEmail = (email?: string): string => {
    const targetEmail = email || currentUser?.email || 'learner@learnx.org';
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveVerificationCode(code);
    setVerificationExpiresAt(Date.now() + 10 * 60 * 1000);
    setVerificationAttempts(0);
    void mockEmailService.sendVerificationCode({
      recipient: targetEmail,
      code,
      expiresInMinutes: 10
    });

    // Add notification item
    const newNotif: NotificationItem = {
      id: `notif_email_${Date.now()}`,
      category: 'skill_verification',
      title: 'Email Verification Code Sent',
      message: `Your LearnX verification code is: ${code}. Enter this code to verify ${targetEmail}.`,
      timestamp: 'Just now',
      read: false,
      actionView: 'profile'
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Verification code sent to ${targetEmail}: ${code}`, 'info');
    return code;
  };

  const verifyEmail = (code: string): boolean => {
    const cleanCode = code.trim();
    if (verificationAttempts >= 5) {
      showToast('Too many incorrect attempts. Please request a new code.', 'error');
      return false;
    }
    if (!activeVerificationCode || Date.now() > verificationExpiresAt) {
      showToast('This verification code has expired. Please request a new code.', 'error');
      return false;
    }
    const isValid = cleanCode === activeVerificationCode;

    if (!isValid) {
      setVerificationAttempts(prev => prev + 1);
      showToast('Invalid verification code. Please check and retry.', 'error');
      return false;
    }

    if (currentUser) {
      const wasAlreadyVerified = currentUser.isEmailVerified;
      const updatedUser: UserProfile = {
        ...currentUser,
        isEmailVerified: true,
        // Reward 2 bonus credits if first time verifying
        timeCredits: wasAlreadyVerified ? currentUser.timeCredits : currentUser.timeCredits + 2,
        totalEarnedCredits: wasAlreadyVerified ? currentUser.totalEarnedCredits : currentUser.totalEarnedCredits + 2
      };

      setCurrentUser(updatedUser);

      if (!wasAlreadyVerified) {
        addTransaction({
          type: 'earned',
          amount: 2,
          description: 'Email Verification Bonus: Account accredited',
          partnerName: 'LearnX Platform',
          skillName: 'Identity Verification',
          date: 'Just now'
        });
        showToast('Email verified successfully! +2 Bonus Time Credits awarded.', 'success');
      } else {
        showToast('Email successfully confirmed!', 'success');
      }
    } else {
      showToast('Email verified!', 'success');
    }

    setIsEmailVerificationModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('login');
    showToast('You have been logged out.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeView,
        setActiveView,
        selectedTrainer,
        setSelectedTrainer,
        selectedSession,
        setSelectedSession,
        selectedCourse,
        setSelectedCourse,
        trainers,
        setTrainers,
        updateTrainerStatus,
        sessions,
        bookSession,
        completeSession,
        walletTransactions,
        addTransaction,
        partnerCourses,
        courses: partnerCourses,
        registerForCourse,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        achievements,
        learningPlan,
        toggleTopicCompleted,
        logout,
        toast,
        showToast,
        isMobileActionModalOpen,
        setIsMobileActionModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        isEmailVerificationModalOpen,
        setIsEmailVerificationModalOpen,
        verifyEmail,
        sendVerificationEmail
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
