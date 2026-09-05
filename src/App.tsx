/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { ToastContainer } from './components/common/Toast';
import { MobileActionModal } from './components/common/MobileActionModal';
import { ReportModal } from './components/common/ReportModal';
import { ScheduleSessionModal } from './components/sessions/ScheduleSessionModal';
import { EmailVerificationModal } from './components/common/EmailVerificationModal';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LearnerDashboard } from './pages/dashboard/LearnerDashboard';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LearnPage } from './pages/learn/LearnPage';
import { TrainerProfilePage } from './pages/trainers/TrainerProfilePage';
import { MyLearningPage } from './pages/learning/MyLearningPage';
import { WalletPage } from './pages/wallet/WalletPage';
import { CommunityPage } from './pages/community/CommunityPage';
import { CourseDetailPage } from './pages/community/CourseDetailPage';
import { CreditPolicyPage } from './pages/policy/CreditPolicyPage';
import { SessionRoomPage } from './pages/sessions/SessionRoomPage';
import { SessionsPage } from './pages/sessions/SessionsPage';
import { AssistantPage } from './pages/ai/AssistantPage';
import { ProfilePage, AchievementsPage, NotificationsPage } from './pages/account/AccountPages';

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  private readonly childContent: React.ReactNode;

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.childContent = props.children;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <img src="/logo.png" alt="LearnX Logo" className="w-16 h-16 bg-white rounded-2xl p-2 mx-auto" />
            <h1 className="text-2xl font-bold mt-5">LearnX needs a refresh</h1>
            <p className="text-slate-400 mt-2">We could not load this screen. Your account data is safe.</p>
            <button onClick={() => window.location.reload()} className="mt-5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-sm">Reload LearnX</button>
          </div>
        </div>
      );
    }
    return this.childContent;
  }
}

const AppContent: React.FC = () => {
  const { activeView, currentUser } = useApp();

  const publicViews = ['landing', 'login', 'register'];
  if (!currentUser && !publicViews.includes(activeView)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1"><LoginPage /></main>
        <ToastContainer />
      </div>
    );
  }

  // If in active 1-on-1 virtual session room, render full screen interactive environment
  if (activeView === 'session-room') {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500 selection:text-slate-950">
        <SessionRoomPage />
        <ToastContainer />
        <ReportModal />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'learner-dashboard':
        return <LearnerDashboard />;
      case 'teacher-dashboard':
        return <TeacherDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'learn':
      case 'discover':
        return <LearnPage />;
      case 'assistant':
        return <AssistantPage />;
      case 'teach':
        return <TeacherDashboard />;
      case 'trainer-profile':
        return <TrainerProfilePage />;
      case 'my-learning':
      case 'quiz':
        return <MyLearningPage />;
      case 'sessions':
        return <SessionsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'community':
      case 'courses':
        return <CommunityPage />;
      case 'course-detail':
        return <CourseDetailPage />;
      case 'profile':
        return <ProfilePage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'policy':
        return <CreditPolicyPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {renderCurrentView()}
      </main>

      {/* Global Modals */}
      <ScheduleSessionModal />
      <ReportModal />
      <MobileActionModal />
      <EmailVerificationModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation for Mobile */}
      <MobileNavigation />
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AppErrorBoundary>
  );
}
