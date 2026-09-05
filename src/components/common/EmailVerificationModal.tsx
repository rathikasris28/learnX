import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { resendVerificationWithApi, verifyEmailWithApi } from '../../services/apiClient';

interface EmailVerificationModalProps {
  emailToVerify?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  emailToVerify,
  isOpen,
  onClose,
  onSuccess
}) => {
  const {
    currentUser,
    isEmailVerificationModalOpen,
    setIsEmailVerificationModalOpen,
    setCurrentUser,
    showToast
  } = useApp();

  const showModal = isOpen !== undefined ? isOpen : isEmailVerificationModalOpen;
  const targetEmail = emailToVerify || currentUser?.email || 'learner@learnx.org';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (!showModal) return;
    setCountdown(45);
    setCanResend(false);
    setIsSuccess(false);
    setErrorMessage('');
    setDigits(['', '', '', '', '', '']);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-focus first input box
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 200);

    return () => clearInterval(timer);
  }, [showModal]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsEmailVerificationModalOpen(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    setErrorMessage('');
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto-focus next box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits are entered
    if (cleanVal && index === 5) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        attemptVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (pastedData.length === 6) {
      attemptVerify(pastedData);
    }
  };

  const attemptVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await verifyEmailWithApi(targetEmail, code);
      setCurrentUser((user) => user ? { ...user, isEmailVerified: true } : user);
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => handleClose(), 1200);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error instanceof Error ? error.message : 'Invalid or expired verification code.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendVerificationWithApi(targetEmail);
      setCountdown(45);
      setCanResend(false);
      setErrorMessage('');
      showToast('A new verification code has been sent.', 'info');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to resend the verification code.');
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.phototourl.com/free/2026-09-05-64dcc94e-b14d-45c2-b144-78f775597507.jpg"
              alt="LearnX Logo"
              className="w-8 h-8 rounded-full bg-white object-cover shadow"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-bold text-base font-heading leading-tight">Verify Your Email</h3>
              <p className="text-[11px] text-teal-100">Secure your LearnX learning account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Incentive Banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs">
            <div className="p-2 rounded-xl bg-teal-500 text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-teal-950">Earn +2 Bonus Time Credits</span>
              <span className="text-[11px] text-teal-800 leading-tight block">
                Verifying your email confirms your identity for 1-on-1 peer sessions and unlocks starter privileges.
              </span>
            </div>
          </div>

          {/* Email Notice */}
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-500">
              We sent a 6-digit confirmation code to:
            </p>
            <p className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5 font-mono">
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              {targetEmail}
            </p>
          </div>

          {/* 6 Digit Input Boxes */}
          <div>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  disabled={isSubmitting || isSuccess}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    digit
                      ? 'border-teal-500 bg-teal-50/40 text-teal-900 font-mono shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-900'
                  } ${errorMessage ? 'border-red-400 bg-red-50/30' : ''}`}
                />
              ))}
            </div>

            {errorMessage && (
              <p className="mt-2.5 text-xs text-red-600 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}

            {isSuccess && (
              <p className="mt-2.5 text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Email verified successfully! Awarding credits...</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              id="btn-confirm-email-otp"
              type="button"
              disabled={isSubmitting || digits.join('').length < 6 || isSuccess}
              onClick={() => attemptVerify()}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified!</span>
                </>
              ) : (
                <>
                  <span>Verify Email Address</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-500 text-[11px]">Check your email or configured development mail service.</span>

              <button
                type="button"
                disabled={!canResend}
                onClick={handleResend}
                className={`font-semibold text-[11px] flex items-center gap-1 ${
                  canResend ? 'text-teal-700 hover:text-teal-900' : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${!canResend ? 'opacity-50' : ''}`} />
                {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
              </button>
            </div>
          </div>

          {/* Safe Badge Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>LearnX Trust & Security Protection</span>
          </div>
        </div>

      </div>
    </div>
  );
};
