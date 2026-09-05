export type UserRole = 'learner' | 'teacher' | 'both' | 'admin';

export type SkillCategory = 'technical' | 'non-technical';

export type SkillProofLevel = 'self-claimed' | 'ai-assessed' | 'community-verified' | 'institution-verified';

export type TrainerStatus = 'active' | 'in-class' | 'inactive';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  country: string;
  state: string;
  city: string;
  languages: string[];
  bio: string;
  joinedDate: string;
  timeCredits: number;
  totalEarnedCredits: number;
  totalUsedCredits: number;
  rating: number;
  reliabilityScore: number; // e.g. 98%
  trustScore: number; // e.g. 94/100
  skillsLearning: string[];
  skillsTeaching: string[];
  learningLevel?: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  teachingLevel?: 'Intermediate' | 'Advanced' | 'Expert';
  learningGoal?: string;
  availability?: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
  isEmailVerified?: boolean;
  termsAccepted: boolean;
  termsVersion: string;
  termsAcceptedDate: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  iconName: string;
  popularMentorsCount: number;
  learnersCount: number;
  levels: string[];
  tags: string[];
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  reviewCount?: number;
  location?: string;
  aiMatchScore: number; // e.g. 96
  languages: string[];
  teachingStyles: string[];
  status: TrainerStatus;
  currentSessionInfo?: string;
  nextAvailableTime?: string;
  reliabilityScore: number;
  trustScore: number;
  completedSessions: number;
  skills: {
    name: string;
    level: SkillProofLevel;
    experienceYears: number;
  }[];
  availabilitySlots: {
    time: string;
    status: 'available' | 'in-class' | 'booked';
  }[];
  matchReasons?: string[];
  reviews?: {
    id: string;
    authorName: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface LearningSession {
  id: string;
  skillTitle: string;
  topic: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  date: string; // "Today", "Tomorrow", "2026-09-08"
  time: string; // "6:00 PM"
  duration: string; // "45 mins"
  creditsCost: number; // usually 1 credit
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  learningGoal: string;
  notes?: string;
  learnerConfirmed?: boolean;
  trainerConfirmed?: boolean;
  ratingGiven?: number;
  feedback?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'earned' | 'used' | 'starter';
  amount: number; // +1, -1, +5
  description: string;
  partnerName?: string;
  skillName?: string;
  date: string;
  timestamp: number;
  sessionId?: string;
}

export interface LearningPathModule {
  id: string;
  title: string;
  topics: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface LearningPlanWeek {
  weekNumber: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  topics: (string | { id: string; title: string; completed: boolean })[];
}

export interface LearningPlan {
  id: string;
  skillName: string;
  duration: string;
  overallProgress: number; // percentage e.g. 72
  trackTitle?: string;
  modules: LearningPathModule[];
  weeks?: LearningPlanWeek[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  skillName: string;
  title: string;
  questions: QuizQuestion[];
}

export interface PartnerCourse {
  id: string;
  title: string;
  partnerOrganization: string;
  category: string;
  duration: string;
  mode: string; // "Online Webinar"
  sessionsCount: number;
  attendanceRequirement: string;
  completionRequirement: string;
  timeCreditRequirement: number; // e.g. 2 credits
  certificateEligible: boolean;
  startDate: string;
  endDate: string;
  schedule: string;
  description: string;
  progressPercent?: number;
  attendedSessions?: number;
  isRegistered?: boolean;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  partnerOrganization: string;
  recipientName: string;
  completionDate: string;
  certificateId: string;
  status: 'Valid' | 'Pending Verification';
  skillsGained: string[];
}

export interface NotificationItem {
  id: string;
  category: 
    | 'ai_match'
    | 'session_accepted'
    | 'session_reminder'
    | 'trainer_active'
    | 'session_completed'
    | 'credit_earned'
    | 'credit_used'
    | 'rating_request'
    | 'skill_verification'
    | 'quiz_result'
    | 'course_registered'
    | 'certificate_ready';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionView?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 to 100
  unlockedDate?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeLearners: number;
  activeTeachers: number;
  learningSessions: number;
  learningHours: number;
  timeCreditsExchanged: number;
  averageRating: number;
  totalPartnerCourses: number;
  issuedCertificates: number;
  pendingReports: number;
}
