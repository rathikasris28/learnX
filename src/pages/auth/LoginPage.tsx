import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { loginWithApi } from '../../services/apiClient';

export const LoginPage: React.FC = () => {
  const { currentUser, activeView, setCurrentUser, setActiveView, setIsEmailVerificationModalOpen, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (activeView === 'login' && currentUser?.isEmailVerified === false) {
      setIsEmailVerificationModalOpen(true);
    }
  }, [activeView, currentUser?.isEmailVerified, setIsEmailVerificationModalOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password.', 'warning');
      return;
    }

    try {
      const result = await loginWithApi(email, password);
      localStorage.setItem('learnx_access_token', result.token);
      setCurrentUser(result.user);
      if (result.verificationRequired || result.user.isEmailVerified === false) {
        setActiveView('login');
        setIsEmailVerificationModalOpen(true);
      } else {
        setActiveView(result.user.role === 'teacher' ? 'teacher-dashboard' : result.user.role === 'admin' ? 'admin-dashboard' : 'learner-dashboard');
      }
      showToast(`A verification code was sent to ${result.user.email}.`, 'info');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to sign in right now.', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center mx-auto overflow-hidden">
            <img
              src="https://cdn.phototourl.com/free/2026-09-05-64dcc94e-b14d-45c2-b144-78f775597507.jpg"
              alt="LearnX Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
            Welcome to Learn<span className="text-teal-600">X</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Exchange. Learn. Grow. Continue your knowledge-sharing journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast('Password reset instructions will be sent to your email.', 'info')}
                className="text-[11px] text-teal-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span>Remember Me</span>
            </label>
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 hover:from-teal-300 hover:to-cyan-200 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>LOGIN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 text-xs text-slate-500">
          Don’t have an account?{' '}
          <button
            onClick={() => setActiveView('register')}
            className="font-bold text-teal-600 hover:underline"
          >
            Register (+5 Starter Credits)
          </button>
        </div>
      </div>
    </div>
  );
};
