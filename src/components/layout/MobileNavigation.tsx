import React from 'react';
import { Home, Compass, Plus, Wallet, User } from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const MobileNavigation: React.FC = () => {
  const { currentUser, activeView, setActiveView, setIsMobileActionModalOpen } = useApp();

  const getDashboardView = (): AppView => {
    if (!currentUser) return 'landing';
    if (currentUser.role === 'teacher') return 'teacher-dashboard';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    return 'learner-dashboard';
  };

  const isHomeActive =
    activeView === 'landing' ||
    activeView === 'learner-dashboard' ||
    activeView === 'teacher-dashboard' ||
    activeView === 'admin-dashboard';

  return (
    <div
      id="mobile-bottom-navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-1.5 shadow-2xl"
    >
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => setActiveView(getDashboardView())}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            isHomeActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        {/* Learn */}
        <button
          id="mobile-nav-learn"
          onClick={() => setActiveView('learn')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            activeView === 'learn' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Learn</span>
        </button>

        {/* Central Floating '+' Action Button */}
        <div className="relative -top-4">
          <button
            id="mobile-nav-central-plus"
            onClick={() => setIsMobileActionModalOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/30 border-2 border-slate-900 active:scale-95 transition-transform"
            aria-label="Open Quick Actions"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Wallet */}
        <button
          id="mobile-nav-wallet"
          onClick={() => setActiveView('wallet')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            activeView === 'wallet' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Wallet</span>
        </button>

        {/* Profile */}
        <button
          id="mobile-nav-profile"
          onClick={() => setActiveView(currentUser ? 'profile' : 'login')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            activeView === 'profile' || activeView === 'login'
              ? 'text-teal-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
};
