import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-white shadow-emerald-900/10 text-slate-800',
    info: 'border-teal-200 bg-white shadow-teal-900/10 text-slate-800',
    warning: 'border-amber-200 bg-white shadow-amber-900/10 text-slate-800',
    error: 'border-red-200 bg-white shadow-red-900/10 text-slate-800'
  };

  return (
    <div
      id="global-toast"
      className="fixed bottom-20 xl:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-auto"
    >
      <div className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 ${borders[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
          {toast.text}
        </div>
      </div>
    </div>
  );
};

export const ToastContainer = Toast;
