import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bell,
  User,
  LogOut,
  Shield,
  BookOpen,
  GraduationCap,
  Calendar,
  Wallet as WalletIcon,
  Trophy,
  Menu,
  X,
  ChevronDown,
  Bot,
  ExternalLink,
  Info,
  CheckCircle2,
  Mail,
  Video
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    selectedSession,
    unreadNotificationsCount,
    logout,
    setIsMobileActionModalOpen,
    setIsEmailVerificationModalOpen
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (view: AppView) => {
    setActiveView(view);
    setIsMobileNavOpen(false);
    setIsProfileMenuOpen(false);
  };

  const getDashboardView = (): AppView => {
    if (!currentUser) return 'landing';
    if (currentUser.role === 'teacher') return 'teacher-dashboard';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    return 'learner-dashboard';
  };

  const navLinks = [
    { label: 'Home', view: getDashboardView() },
    { label: 'Learn', view: 'learn' as AppView },
    { label: 'Teach', view: 'teach' as AppView },
    { label: 'Discover', view: 'discover' as AppView },
    { label: 'My Learning', view: 'my-learning' as AppView },
    { label: 'Sessions', view: 'sessions' as AppView },
    { label: 'AI Assistant', view: 'assistant' as AppView, badge: 'AI' },
    { label: 'Courses', view: 'courses' as AppView },
    { label: 'Wallet', view: 'wallet' as AppView }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleNav(currentUser ? getDashboardView() : 'landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="LearnX Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                    Learn<span className="text-teal-400">X</span>
                  </span>
                  <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded">
                    Peer Exchange
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                  Exchange. Learn. Grow.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.label}
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNav(item.view)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1 py-0.2 text-[9px] font-bold uppercase rounded bg-gradient-to-r from-blue-500 to-teal-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live 1-on-1 Session Room Button */}
            <button
              id="navbar-live-room-btn"
              onClick={() => handleNav(selectedSession ? 'session-room' : 'sessions')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20 transition-all"
              title="Enter 1-on-1 Face-to-Face Live Video Room"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <Video className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Live Video Room</span>
            </button>

            {/* Time Credit Pill */}
            {currentUser && (
              <button
                id="navbar-wallet-pill"
                onClick={() => handleNav('wallet')}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-teal-500/40 text-teal-300 text-xs font-semibold shadow-inner transition-all"
                title="Time Credits have no cash value. Non-monetary peer exchange unit."
              >
                <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                </div>
                <span className="font-bold text-white tracking-wide">
                  {currentUser.timeCredits}
                </span>
                <span className="text-[11px] text-teal-300 hidden md:inline">Credits</span>
                <span className="hidden lg:inline-block text-[9px] text-slate-400 border-l border-slate-700 pl-1.5">
                  No Cash Value
                </span>
              </button>
            )}

            {/* Notifications Bell */}
            {currentUser && (
              <button
                id="navbar-notifications-btn"
                onClick={() => handleNav('notifications')}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Dropdown & Role Switcher */}
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  id="navbar-user-avatar-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors focus:outline-none"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-teal-400/50"
                  />
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 hidden md:inline">
                    {currentUser.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    id="navbar-profile-dropdown"
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      
                      {/* Email Verification Status */}
                      <div className="mt-1.5 pt-1 flex items-center justify-between border-t border-slate-800/60">
                        {currentUser.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Email Verified
                          </span>
                        ) : (
                          <button
                            id="btn-navbar-verify-email"
                            onClick={() => {
                              setIsEmailVerificationModalOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-700/60 hover:bg-amber-900/60 px-2 py-0.5 rounded-full transition"
                          >
                            <Mail className="w-3 h-3 text-amber-400" />
                            Verify Email (+2 Credits)
                          </button>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {currentUser.timeCredits} Credits
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        id="dropdown-my-profile-btn"
                        onClick={() => handleNav('profile')}
                        className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-teal-400" />
                        My Profile & Settings
                      </button>
                      <button
                        id="dropdown-achievements-btn"
                        onClick={() => handleNav('achievements')}
                        className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        Achievements & Skill Journey
                      </button>
                      <button
                        id="dropdown-policy-btn"
                        onClick={() => handleNav('policy')}
                        className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5"
                      >
                        <Info className="w-4 h-4 text-blue-400" />
                        Time Credit Policy
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        id="dropdown-logout-btn"
                        onClick={logout}
                        className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out (Guest Mode)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-login-btn"
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  id="navbar-register-btn"
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 rounded-lg shadow-sm transition-all"
                >
                  Start Learning (+5 Credits)
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileNavOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1 shadow-2xl">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.view)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeView === item.view
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => handleNav('policy')}
              className="flex-1 text-center py-2 text-xs text-slate-400 hover:text-teal-300 bg-slate-800/60 rounded"
            >
              Time Credit Policy
            </button>
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                setIsMobileActionModalOpen(true);
              }}
              className="flex-1 text-center py-2 text-xs text-slate-950 font-bold bg-teal-400 rounded"
            >
              + Quick Actions
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
