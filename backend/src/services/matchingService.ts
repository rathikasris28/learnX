export type SkillLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Expert';

export interface MatchRequest {
  skill: string;
  level?: SkillLevel;
  language?: string;
  languages?: string[];
  goal?: string;
  teachingStyle?: string;
  availability?: string[];
  country?: string;
  state?: string;
  city?: string;
}

export interface MatchCandidate {
  id: string;
  name: string;
  skillNames: string[];
  skillLevels: Record<string, SkillLevel>;
  languages: string[];
  availability: string[];
  teachingStyles: string[];
  rating: number;
  reviewsCount: number;
  trustScore: number;
  quizScore: number;
  reliability: number;
  completedSessions: number;
  cancelledSessions: number;
  avatar?: string | null;
  bio?: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
}

export interface MatchResult extends MatchCandidate {
  matchScore: number;
  matchLevel: 'Excellent Match' | 'Strong Match' | 'Good Match' | 'Partial Match';
  reasons: string[];
  breakdown: {
    skill: number;
    level: number;
    trust: number;
    rating: number;
    language: number;
    availability: number;
    location: number;
    quiz: number;
  };
}

const levelRank: Record<SkillLevel, number> = {
  Beginner: 1,
  Elementary: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

const normalized = (value: string) => value.trim().toLowerCase();

function overlapScore(requested: string[], available: string[]) {
  if (!requested.length || !available.length) return 50;
  const availableValues = available.map(normalized);
  const overlap = requested.filter((value) => availableValues.includes(normalized(value))).length;
  return Math.round((overlap / requested.length) * 100);
}

function scoreLevel(requested: SkillLevel | undefined, candidate: SkillLevel | undefined) {
  if (!requested || !candidate) return 8;
  const difference = levelRank[candidate] - levelRank[requested];
  if (difference < 0) return 0;
  if (difference === 0) return 8;
  if (difference === 1) return 12;
  return 15;
}

function trustPoints(score: number) {
  return Math.round(Math.max(0, Math.min(100, score)) * 0.15);
}

function locationPoints(request: MatchRequest, candidate: MatchCandidate) {
  if (!request.country || !candidate.country) return 1;
  if (request.city && normalized(request.city) === normalized(candidate.city || '')) return 5;
  if (request.state && normalized(request.state) === normalized(candidate.state || '')) return 4;
  if (normalized(request.country) === normalized(candidate.country)) return 3;
  return 1;
}

function getMatchLevel(score: number): MatchResult['matchLevel'] {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Partial Match';
}

export function calculateMatchScore(values: MatchResult['breakdown']) {
  return Math.round(
    values.skill + values.level + values.trust + values.rating + values.language + values.availability + values.location + values.quiz
  );
}

export function rankMatches(request: MatchRequest, candidates: MatchCandidate[]): MatchResult[] {
  const requestedLanguages = request.languages?.length
    ? request.languages
    : request.language && request.language !== 'all'
      ? [request.language]
      : [];

  return candidates
    .filter((candidate) => candidate.skillNames.some((skill) => normalized(skill) === normalized(request.skill)))
    .map((candidate) => {
      const skillName = candidate.skillNames.find((skill) => normalized(skill) === normalized(request.skill)) || request.skill;
      const breakdown = {
        skill: 30,
        level: scoreLevel(request.level, candidate.skillLevels[skillName]),
        trust: trustPoints(candidate.trustScore),
        rating: Math.round((Math.max(0, Math.min(5, candidate.rating)) / 5) * 10),
        language: requestedLanguages.length ? (overlapScore(requestedLanguages, candidate.languages) === 100 ? 10 : overlapScore(requestedLanguages, candidate.languages) > 0 ? 6 : 0) : 5,
        availability: request.availability?.length ? (overlapScore(request.availability, candidate.availability) === 100 ? 10 : overlapScore(request.availability, candidate.availability) > 0 ? 5 : 0) : 5,
        location: locationPoints(request, candidate),
        quiz: candidate.quizScore > 0 ? Math.round(Math.min(100, candidate.quizScore) / 100 * 5) : 0
      };
      const matchScore = calculateMatchScore(breakdown);
      const reasons: string[] = [`Teaches ${skillName}`];
      if (breakdown.level >= 12) reasons.push(`${candidate.skillLevels[skillName] || 'Experienced'} level supports your learning level`);
      if (breakdown.language >= 6 && requestedLanguages.length) reasons.push(`Shares ${candidate.languages.filter((language) => requestedLanguages.map(normalized).includes(normalized(language))).join(' and ')}`);
      if (breakdown.availability >= 5 && request.availability?.length) reasons.push('Available during your preferred time');
      if (candidate.trustScore >= 75) reasons.push(`High trust score (${candidate.trustScore}/100)`);
      if (candidate.rating >= 4.5 && candidate.reviewsCount > 0) reasons.push(`High rating (${candidate.rating.toFixed(1)}/5)`);
      if (candidate.quizScore >= 60) reasons.push('Skill verified by quiz');

      return { ...candidate, matchScore, matchLevel: getMatchLevel(matchScore), reasons, breakdown };
    })
    .sort((first, second) => second.matchScore - first.matchScore);
}
