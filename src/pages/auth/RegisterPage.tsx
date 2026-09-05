import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Plus,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';
import { ALL_SKILLS } from '../../constants/skillsData';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';

export const RegisterPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    setActiveView,
    showToast,
    setIsEmailVerificationModalOpen,
    sendVerificationEmail
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Basic Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [cityName, setCityName] = useState('Chennai');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Role Selection
  const [role, setRole] = useState<UserRole>('learner');

  // Step 3: Languages
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Tamil']);
  const [customLanguage, setCustomLanguage] = useState('');

  // Step 4: Role-Based Onboarding
  // Learner fields
  const [skillsLearning, setSkillsLearning] = useState<string[]>(['Python', 'English Speaking']);
  const [learningLevel, setLearningLevel] = useState<'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced'>('Beginner');
  const [learningGoal, setLearningGoal] = useState('Career Development');

  // Teacher fields
  const [skillsTeaching, setSkillsTeaching] = useState<string[]>(['Python', 'Web Development']);
  const [teachingLevel, setTeachingLevel] = useState<'Intermediate' | 'Advanced' | 'Expert'>('Advanced');
  const [teachingLanguages, setTeachingLanguages] = useState<string[]>(['Tamil', 'English']);
  const [availability, setAvailability] = useState<('Morning' | 'Afternoon' | 'Evening' | 'Night')[]>([
    'Evening',
    'Night'
  ]);

  // Step 6: Terms and Conditions
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form error state
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passStrength = getPasswordStrength(password);

  // Step Nav validation
  const validateStep1 = () => {
    if (!fullName.trim() || !email.trim() || !country || !stateName || !cityName) {
      setErrorMsg('Please fill in all basic personal details.');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please provide a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep === 3) {
      if (selectedLanguages.length === 0) {
        setErrorMsg('Please choose at least one preferred language.');
        return;
      }
      setErrorMsg('');
    }
    if (currentStep === 4) {
      if (role !== 'teacher' && skillsLearning.length === 0) {
        setErrorMsg('Please select at least one skill you wish to learn.');
        return;
      }
      if (role !== 'learner' && skillsTeaching.length === 0) {
        setErrorMsg('Please select at least one skill you are confident in sharing.');
        return;
      }
      setErrorMsg('');
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLanguage.trim()) return;
    if (!selectedLanguages.includes(customLanguage.trim())) {
      setSelectedLanguages([...selectedLanguages, customLanguage.trim()]);
    }
    setCustomLanguage('');
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const toggleSkillLearning = (skillName: string) => {
    if (skillsLearning.includes(skillName)) {
      setSkillsLearning(skillsLearning.filter((s) => s !== skillName));
    } else {
      setSkillsLearning([...skillsLearning, skillName]);
    }
  };

  const toggleSkillTeaching = (skillName: string) => {
    if (skillsTeaching.includes(skillName)) {
      setSkillsTeaching(skillsTeaching.filter((s) => s !== skillName));
    } else {
      setSkillsTeaching([...skillsTeaching, skillName]);
    }
  };

  const toggleAvailability = (slot: 'Morning' | 'Afternoon' | 'Evening' | 'Night') => {
    if (availability.includes(slot)) {
      if (availability.length > 1) {
        setAvailability(availability.filter((s) => s !== slot));
      }
    } else {
      setAvailability([...availability, slot]);
    }
  };

  // Complete Registration
  const handleCompleteRegistration = () => {
    if (!termsAccepted) {
      setErrorMsg('You must agree to the Terms and Conditions to complete registration.');
      return;
    }

    // Learner gets +5 starter credits, Teacher gets 0
    const startingCredits = role === 'teacher' ? 0 : 5;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: fullName,
      email,
      role,
      avatar:
          role !== 'teacher'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      country,
      state: stateName,
      city: cityName,
      languages: selectedLanguages,
      bio:
          role !== 'teacher'
          ? `Learner excited to master ${skillsLearning.join(', ')}.`
          : `Knowledge Sharer passionate about helping peers learn ${skillsTeaching.join(', ')}.`,
      joinedDate: 'September 2026',
      timeCredits: startingCredits,
      totalEarnedCredits: 0,
      totalUsedCredits: 0,
      rating: 5.0,
      reliabilityScore: 100,
      trustScore: 90,
      skillsLearning: role !== 'teacher' ? skillsLearning : [],
      skillsTeaching: role !== 'learner' ? skillsTeaching : [],
      learningLevel: role !== 'teacher' ? learningLevel : undefined,
      teachingLevel: role !== 'learner' ? teachingLevel : undefined,
      learningGoal: role !== 'teacher' ? learningGoal : undefined,
      availability: role !== 'learner' ? availability : undefined,
      termsAccepted: true,
      termsVersion: '1.0',
      termsAcceptedDate: new Date().toISOString()
    };

    setCurrentUser(newUser);
    sendVerificationEmail(email);
    setIsEmailVerificationModalOpen(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }

    setCurrentStep(7);
  };

  const stepsLabel = [
    'Basic Information',
    'Role Selection',
    'Language Preferences',
    'Onboarding Details',
    'Review Profile',
    'Terms & Conditions',
    'Completion'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Brand Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md border border-slate-200 flex items-center justify-center mb-2 overflow-hidden">
          <img
            src="/logo.png"
            alt="LearnX Logo"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
          Learn<span className="text-teal-600">X</span> Onboarding
        </h1>
        <p className="text-xs text-slate-500">Exchange. Learn. Grow.</p>
      </div>

      {/* Wizard Progress Bar */}
      {currentStep < 7 && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="text-teal-700 font-bold uppercase tracking-wider font-heading">
              Step {currentStep} of 6: {stepsLabel[currentStep - 1]}
            </span>
            <span>{Math.round((currentStep / 6) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error notification banner */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              Create Your LearnX Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Join our verified peer-to-peer knowledge and learning exchange platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sundaram"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@learnx.org"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / Province *
              </label>
              <input
                type="text"
                required
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City * (Exact home addresses are never published publicly)
              </label>
              <input
                type="text"
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="e.g. Chennai"
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3, 4].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 h-full ${
                          passStrength >= lvl
                            ? passStrength >= 3
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {passStrength >= 3 ? 'Strong' : passStrength >= 2 ? 'Fair' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveView('login')}
              className="text-xs font-semibold text-slate-600 hover:text-teal-600"
            >
              Already registered? Log in
            </button>
            <button
              type="button"
              id="step-1-continue-btn"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Continue to Role Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Role Selection */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              How do you want to use LearnX?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your primary mode. You can always exchange and share knowledge later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* LEARNER CARD */}
            <div
              onClick={() => setRole('learner')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                role === 'learner'
                  ? 'border-teal-500 bg-teal-50/40 shadow-lg shadow-teal-500/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl shadow-sm">
                    🎓
                  </div>
                  {role === 'learner' && (
                    <CheckCircle2 className="w-6 h-6 text-teal-600" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  LEARNER
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I want to learn new skills from other people.
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Popular Examples:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                    <li>Learn Python & Web Development</li>
                    <li>Learn Spoken English Fluency</li>
                    <li>Learn AI, Data Science & Cloud</li>
                    <li>Learn Public Speaking & Cooking</li>
                  </ul>
                </div>
              </div>

              {/* Starter credit badge */}
              <div className="mt-6 pt-4 border-t border-teal-200/60">
                <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-900 flex items-center justify-between">
                  <span className="text-xs font-medium">Starter Balance:</span>
                  <span className="text-sm font-extrabold text-teal-800 tracking-wide font-heading">
                    +5 STARTER TIME CREDITS
                  </span>
                </div>
                <p className="text-[10px] text-teal-700/80 mt-1.5 text-center">
                  Non-monetary unit • No cash value • Access eligible learning sessions
                </p>
              </div>
            </div>

            <div
              onClick={() => setRole('both')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                role === 'both' ? 'border-cyan-500 bg-cyan-50/40 shadow-lg shadow-cyan-500/10' : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4"><div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-2xl">🤝</div>{role === 'both' && <CheckCircle2 className="w-6 h-6 text-cyan-600" />}</div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">LEARN & SHARE</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">I want to learn skills and share what I know.</p>
              </div>
              <div className="mt-6 pt-4 border-t border-cyan-200/60"><div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-900 text-center"><span className="text-sm font-extrabold font-heading">+5 STARTER TIME CREDITS</span></div><p className="text-[10px] text-cyan-700/80 mt-1.5 text-center">Learn and teach in one account</p></div>
            </div>

            {/* TEACHER / KNOWLEDGE SHARER CARD */}
            <div
              onClick={() => setRole('teacher')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                role === 'teacher'
                  ? 'border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-500/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl shadow-sm">
                    🧑‍🏫
                  </div>
                  {role === 'teacher' && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  TEACHER / SHARER
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I want to share my knowledge and help other people learn.
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Benefits & Roles:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                    <li>Share knowledge you are confident in</li>
                    <li>Help motivated community learners</li>
                    <li>Build your Trust & Reliability Score</li>
                    <li>Earn eligible Time Credits per verified session</li>
                  </ul>
                </div>
              </div>

              {/* Starter balance for teacher */}
              <div className="mt-6 pt-4 border-t border-blue-200/60">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 flex items-center justify-between">
                  <span className="text-xs font-medium">Starting Balance:</span>
                  <span className="text-sm font-extrabold text-blue-900 tracking-wide font-heading">
                    0 TIME CREDITS
                  </span>
                </div>
                <p className="text-[10px] text-blue-700/80 mt-1.5 text-center">
                  Earn +1 Time Credit for each verified peer-to-peer session you conduct
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back
            </button>
            <button
              type="button"
              id="step-2-continue-btn"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Continue with {role === 'learner' ? 'Learner' : role === 'teacher' ? 'Knowledge Sharer' : 'Learner & Sharer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Language Selection */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              Which languages do you prefer?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select one or more languages for peer sessions and AI teacher recommendations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam'].map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Language */}
            <div className="pt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Other Languages (Search / Add)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="e.g. French, Bengali, German"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomLanguage}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-600 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" />
              <span>
                Selected: <strong>{selectedLanguages.join(', ')}</strong>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Continue to Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Role-Based Onboarding */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {role !== 'teacher' ? (
            /* LEARNER ONBOARDING */
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                  What do you want to learn?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose the skills you are looking to master in 1-on-1 peer sessions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Skills to Learn (Multiple choices allowed):
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {ALL_SKILLS.map((skill) => {
                    const isSelected = skillsLearning.includes(skill.name);
                    return (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => toggleSkillLearning(skill.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Current Knowledge Level:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Beginner', 'Elementary', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setLearningLevel(lvl)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                        learningLevel === lvl
                          ? 'bg-teal-50 border-teal-500 text-teal-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Main Learning Goal:
                </label>
                <select
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Career Development">Career Development & Placements</option>
                  <option value="Academic Learning">Academic Coursework & Exams</option>
                  <option value="Personal Growth">Personal Growth & Curiosity</option>
                  <option value="Improve Communication">Improve Communication & Fluency</option>
                  <option value="Learn a New Technology">Learn a New Technology / Tool</option>
                  <option value="Other">Other Personal Goal</option>
                </select>
              </div>
            </div>
          ) : (
            /* TEACHER ONBOARDING */
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                  What knowledge can you share?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  List skills you feel confident explaining to fellow peers.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Skills to Share:
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {ALL_SKILLS.map((skill) => {
                    const isSelected = skillsTeaching.includes(skill.name);
                    return (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => toggleSkillTeaching(skill.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Knowledge Level:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Intermediate', 'Advanced', 'Expert'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setTeachingLevel(lvl)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                        teachingLevel === lvl
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  When are you usually available for peer sessions?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((slot) => {
                    const isSelected = availability.includes(slot);
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => toggleAvailability(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Review Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review Profile */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                Review Your Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verify your details before reviewing platform terms.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-teal-100 text-teal-800">
              {role}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs sm:text-sm">
            <div className="p-4 flex justify-between items-center bg-slate-50/50">
              <span className="font-semibold text-slate-600">Full Name</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">{fullName}</span>
                <button onClick={() => setCurrentStep(1)} className="text-xs text-teal-600 hover:underline">
                  Edit
                </button>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <span className="font-semibold text-slate-600">Email</span>
              <span className="text-slate-800">{email}</span>
            </div>

            <div className="p-4 flex justify-between items-center bg-slate-50/50">
              <span className="font-semibold text-slate-600">Location</span>
              <span className="text-slate-800">{cityName}, {stateName}, {country}</span>
            </div>

            <div className="p-4 flex justify-between items-center">
              <span className="font-semibold text-slate-600">Languages</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-800 font-medium">{selectedLanguages.join(', ')}</span>
                <button onClick={() => setCurrentStep(3)} className="text-xs text-teal-600 hover:underline">
                  Edit
                </button>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center bg-slate-50/50">
              <span className="font-semibold text-slate-600">
                {role === 'teacher' ? 'Knowledge to Share' : 'Skills to Learn'}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-teal-700 font-semibold">
                  {role === 'teacher' ? skillsTeaching.join(', ') : skillsLearning.join(', ')}
                </span>
                <button onClick={() => setCurrentStep(4)} className="text-xs text-teal-600 hover:underline">
                  Edit
                </button>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <span className="font-semibold text-slate-600">
                {role === 'teacher' ? 'Availability Slots' : 'Learning Goal'}
              </span>
              <span className="text-slate-800">
                {role === 'teacher' ? availability.join(', ') : learningGoal}
              </span>
            </div>

            {/* Starting Credits Display */}
            <div className="p-4 flex justify-between items-center bg-teal-50/70 text-teal-950 font-semibold">
              <span>Starting Time Credits</span>
              <span className="text-sm font-extrabold text-teal-800">
                {role === 'teacher' ? '0 Credits (Earn by sharing)' : '+5 Starter Credits'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Accept Terms & Complete</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Mandatory Terms and Conditions */}
      {currentStep === 6 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
              Step 6 of 6 — Mandatory User Agreement
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
              LearnX Platform Terms & Non-Monetary Declaration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Please review our community principles. You must accept these terms to register.
            </p>
          </div>

          {/* 4 Information Cards: LEARN, SHARE, TIME, GROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-1">
              <span className="font-extrabold text-teal-900 font-heading text-sm">1. LEARN</span>
              <p className="text-slate-600 leading-relaxed">
                Learn technical and non-technical knowledge in respectful 1-on-1 peer sessions.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
              <span className="font-extrabold text-blue-900 font-heading text-sm">2. SHARE</span>
              <p className="text-slate-600 leading-relaxed">
                Share skills you are confident in. Provide constructive, honest peer mentoring.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1">
              <span className="font-extrabold text-indigo-900 font-heading text-sm">3. TIME</span>
              <p className="text-slate-600 leading-relaxed">
                Verified eligible participation generates Time Credits according to platform rules.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/40 space-y-1">
              <span className="font-extrabold text-cyan-900 font-heading text-sm">4. GROW</span>
              <p className="text-slate-600 leading-relaxed">
                Use eligible learning opportunities and partner programs to continue developing skills.
              </p>
            </div>
          </div>

          {/* IMPORTANT NOTICE CARD */}
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-amber-950 text-sm sm:text-base font-heading uppercase">
                  LearnX is NOT a Freelancing Platform
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  LearnX is <strong>NOT a job marketplace, salary platform, or money-making application.</strong>
                </p>
                <div className="p-3 bg-amber-100/80 rounded-xl border border-amber-200 text-xs text-amber-950 font-bold space-y-1">
                  <p>TIME CREDITS HAVE NO CASH VALUE</p>
                  <ul className="list-disc list-inside font-medium text-[11px] text-amber-900 space-y-0.5 pl-1">
                    <li>Time Credits are NOT money</li>
                    <li>Cannot be withdrawn to a bank account or wallet</li>
                    <li>Cannot be converted into cash</li>
                    <li>Cannot be sold or traded</li>
                    <li>Cannot be treated as salary or freelance income</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* MANDATORY USER ACKNOWLEDGEMENT LIST */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 font-heading uppercase tracking-wide">
              Mandatory User Acknowledgements:
            </h4>
            <ul className="space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>LearnX is a learning and knowledge exchange platform, not a freelancing or gig network.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Knowledge sharing does not guarantee financial payment or monetary employment.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Time Credits are non-monetary, have no cash value, and cannot be withdrawn.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Users must provide accurate information and never falsely claim skills or credentials.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Users must treat fellow peers respectfully and adhere to safety & integrity guidelines.</span>
              </li>
            </ul>
          </div>

          {/* Mandatory Checkbox */}
          <div className="p-4 rounded-xl border border-teal-300 bg-teal-50/30 flex items-start gap-3">
            <input
              type="checkbox"
              id="mandatory-terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
            <label htmlFor="mandatory-terms-checkbox" className="text-xs text-slate-800 leading-relaxed cursor-pointer font-medium">
              I have read and agree to the <strong>LearnX Terms and Conditions</strong> and understand that LearnX is a time-based learning and knowledge exchange platform, <strong>not a freelancing or money-earning platform</strong>.
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back
            </button>
            <button
              type="button"
              id="complete-registration-btn"
              disabled={!termsAccepted}
              onClick={handleCompleteRegistration}
              className={`px-7 py-3 text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition flex items-center gap-2 ${
                termsAccepted
                  ? 'bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500 text-slate-950 hover:from-teal-400 hover:to-blue-400 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>COMPLETE REGISTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Registration Celebration Screen */}
      {currentStep === 7 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 text-slate-950 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-teal-500/20 animate-bounce">
            🎉
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Registration Successful
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Welcome to LearnX, {fullName.split(' ')[0]}!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {role !== 'teacher'
                ? 'Your learning and knowledge exchange journey starts right now.'
                : 'Start sharing your knowledge and helping fellow community learners grow.'}
            </p>
          </div>

          {/* Credit balance display card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 via-slate-50 to-blue-50 border border-teal-200 max-w-sm mx-auto shadow-sm space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Current Balance
            </span>
            <div className="text-3xl font-extrabold text-teal-800 font-heading">
              {currentUser?.timeCredits ?? (role === 'teacher' ? 0 : 5)} Time Credits
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {role !== 'teacher'
                ? 'Your starter Time Credits help you access eligible learning opportunities. They are not money and have no cash value.'
                : 'Verified knowledge-sharing participation may earn eligible Time Credits according to LearnX rules.'}
            </p>
          </div>

          {/* Email Verification Box */}
          <div className="p-5 rounded-2xl border max-w-md mx-auto transition-all text-left bg-slate-50 border-slate-200">
            {currentUser?.isEmailVerified ? (
              <div className="flex items-center gap-3 text-emerald-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Email Address Verified</h4>
                  <p className="text-xs text-emerald-800">Your account is fully secured and eligible for live face-to-face sessions.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">Verify Your Email Address</h4>
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                        +2 Bonus Credits
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Verify <strong>{email || currentUser?.email}</strong> to activate 1-on-1 peer sessions and claim 2 bonus credits.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      sendVerificationEmail(email || currentUser?.email);
                      setIsEmailVerificationModalOpen(true);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enter Verification Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('You can verify your email anytime from your profile.', 'info');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition"
                  >
                    Later
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveView(role === 'teacher' ? 'teacher-dashboard' : 'learner-dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 hover:from-teal-300 hover:to-cyan-200 shadow-lg text-sm transition"
            >
              {role === 'teacher' ? 'START SHARING KNOWLEDGE' : 'START LEARNING'}
            </button>
            <button
              onClick={() => setActiveView('policy')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 text-xs"
            >
              Review Credit Policy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
