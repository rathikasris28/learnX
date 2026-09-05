import { UserProfile, UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  languages: string[];
  bio: string;
  isEmailVerified: boolean;
  termsAccepted: boolean;
  termsVersion: string | null;
  termsAcceptedDate: string | null;
  timeCredits: number;
  totalEarnedCredits: number;
  totalUsedCredits: number;
  rating: number;
  reliabilityScore: number;
  trustScore: number;
  joinedDate: string;
  skillsLearning?: string[];
  skillsTeaching?: string[];
};

type AuthResponse = { user: ApiUser; token: string; verificationRequired: boolean };

export type MatchRequest = {
  skill: string;
  level?: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Expert';
  language?: string;
  languages?: string[];
  goal?: string;
  teachingStyle?: string;
  availability?: string[];
};

export type ApiMatch = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string;
  languages: string[];
  availability: string[];
  rating: number;
  reviewsCount: number;
  trustScore: number;
  quizScore: number;
  reliability: number;
  completedSessions: number;
  skillNames: string[];
  matchScore: number;
  matchLevel: string;
  reasons: string[];
  breakdown: Record<string, number>;
};

export type ApiSkill = {
  id: string;
  name: string;
  domain: 'technical' | 'non-technical';
  category: string;
  description: string;
  levels: string[];
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const payload = (await response.json().catch(() => ({}))) as { error?: string; details?: unknown };
  if (!response.ok) {
    throw new Error(payload.error || 'The server request failed');
  }
  return payload as T;
}

export function mapApiUser(user: ApiUser): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    country: user.country || '',
    state: user.state || '',
    city: user.city || '',
    languages: user.languages,
    bio: user.bio,
    joinedDate: user.joinedDate,
    timeCredits: user.timeCredits,
    totalEarnedCredits: user.totalEarnedCredits,
    totalUsedCredits: user.totalUsedCredits,
    rating: user.rating,
    reliabilityScore: user.reliabilityScore,
    trustScore: user.trustScore,
    skillsLearning: user.skillsLearning || [],
    skillsTeaching: user.skillsTeaching || [],
    isEmailVerified: user.isEmailVerified,
    termsAccepted: user.termsAccepted,
    termsVersion: user.termsVersion || '1.0',
    termsAcceptedDate: user.termsAcceptedDate || new Date().toISOString()
  };
}

export async function registerWithApi(input: Record<string, unknown>) {
  const result = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input)
  });
  return { ...result, user: mapApiUser(result.user) };
}

export async function loginWithApi(email: string, password: string) {
  const result = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return { ...result, user: mapApiUser(result.user) };
}

export async function verifyEmailWithApi(email: string, code: string) {
  return request<{ message: string }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code })
  });
}

export async function resendVerificationWithApi(email: string) {
  return request<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function findMatchesWithApi(input: MatchRequest) {
  const token = localStorage.getItem('learnx_access_token');
  return request<{ matches: ApiMatch[] }>('/matches', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify(input)
  });
}

export function mapApiMatchToTrainer(match: ApiMatch) {
  return {
    id: match.id,
    name: match.name,
    title: match.skillNames[0] ? `${match.skillNames[0]} Knowledge Sharer` : 'Knowledge Sharer',
    bio: match.bio,
    avatar: match.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: match.rating,
    reviewsCount: match.reviewsCount,
    reviewCount: match.reviewsCount,
    aiMatchScore: match.matchScore,
    languages: match.languages,
    teachingStyles: [],
    status: 'active' as const,
    reliabilityScore: match.reliability,
    trustScore: match.trustScore,
    completedSessions: match.completedSessions,
    skills: match.skillNames.map((name) => ({ name, level: 'Advanced' as const, experienceYears: 0 })),
    availabilitySlots: match.availability.map((time) => ({ time, status: 'available' as const })),
    matchReasons: match.reasons
  };
}

export async function getSkillsFromApi(query = '') {
  return request<{ skills: ApiSkill[] }>(`/skills?q=${encodeURIComponent(query)}`);
}

export async function bookSessionWithApi(input: {
  trainerId: string;
  skill: string;
  topic: string;
  startsAt: string;
  endsAt: string;
  learningGoal: string;
}) {
  const token = localStorage.getItem('learnx_access_token');
  return request<{ session: { id: string; meeting_room_id: string } }>('/sessions', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify(input)
  });
}
