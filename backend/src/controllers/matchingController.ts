import { Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { MatchCandidate, MatchRequest, SkillLevel, rankMatches } from '../services/matchingService.js';

const matchRequestSchema = z.object({
  skill: z.string().trim().min(1).max(120),
  level: z.enum(['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']).optional(),
  language: z.string().trim().max(50).optional(),
  languages: z.array(z.string().trim().max(50)).max(20).optional(),
  goal: z.string().trim().max(160).optional(),
  teachingStyle: z.string().trim().max(80).optional(),
  availability: z.array(z.string().trim().max(80)).max(20).optional(),
  country: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional()
});

type CandidateRow = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string;
  languages: string[];
  availability: string[];
  teaching_styles: string[];
  rating: number;
  reviews_count: number;
  trust_score: number;
  quiz_score: number | null;
  reliability_score: number;
  completed_sessions: number;
  cancelled_sessions: number;
  country: string | null;
  state: string | null;
  city: string | null;
  skill_name: string;
  skill_level: SkillLevel;
};

export async function getMatches(request: AuthRequest, response: Response) {
  const body = matchRequestSchema.parse(request.method === 'GET' ? request.query : request.body) as MatchRequest;
  const learnerResult = await query<{ level: SkillLevel | null; languages: string[]; country: string | null; state: string | null; city: string | null }>(
    `SELECT u.languages, u.country, u.state, u.city, us.level
     FROM users u LEFT JOIN user_skills us ON us.user_id = u.id AND us.direction = 'learn' AND EXISTS (
       SELECT 1 FROM skills s2 WHERE s2.id = us.skill_id AND LOWER(s2.name) = LOWER($2)
     ) WHERE u.id = $1 LIMIT 1`,
    [request.auth!.userId, body.skill]
  );
  const learner = learnerResult.rows[0];
  const input: MatchRequest = {
    ...body,
    level: body.level || learner?.level || undefined,
    languages: body.languages?.length ? body.languages : learner?.languages || [],
    country: learner?.country || undefined,
    state: learner?.state || undefined,
    city: learner?.city || undefined
  };
  const result = await query<CandidateRow>(
    `SELECT u.id, u.name, u.avatar, u.bio, u.languages, u.availability, u.teaching_styles,
            u.rating, COALESCE(r.reviews_count, 0)::int AS reviews_count,
            COALESCE(ts.final_trust_score, u.trust_score, 0)::float AS trust_score,
            COALESCE(q.quiz_score, 0)::float AS quiz_score,
            u.reliability_score, COALESCE(s.completed_sessions, 0)::int AS completed_sessions,
            COALESCE(s.cancelled_sessions, 0)::int AS cancelled_sessions,
                 u.country, u.state, u.city,
                 skill.name AS skill_name, us.level AS skill_level
     FROM users u
     JOIN user_skills us ON us.user_id = u.id AND us.direction = 'teach'
               JOIN skills skill ON skill.id = us.skill_id
     LEFT JOIN trust_scores ts ON ts.user_id = u.id
     LEFT JOIN (
       SELECT trainer_id, COUNT(*)::int AS reviews_count
       FROM reviews GROUP BY trainer_id
     ) r ON r.trainer_id = u.id
     LEFT JOIN (
       SELECT trainer_id,
              COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_sessions,
              COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_sessions
       FROM learning_sessions GROUP BY trainer_id
     ) s ON s.trainer_id = u.id
     LEFT JOIN (
       SELECT user_id, MAX(quiz_score)::float AS quiz_score
       FROM user_skills WHERE quiz_score IS NOT NULL GROUP BY user_id
     ) q ON q.user_id = u.id
     WHERE u.role IN ('teacher', 'both')
       AND u.is_email_verified = TRUE
      AND LOWER(skill.name) = LOWER($1)
     ORDER BY trust_score DESC, u.rating DESC`,
    [input.skill]
  );

  const candidates: MatchCandidate[] = result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    bio: row.bio,
    skillNames: [row.skill_name],
    skillLevels: { [row.skill_name]: row.skill_level },
    languages: row.languages || [],
    availability: row.availability || [],
    teachingStyles: row.teaching_styles || [],
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    trustScore: Number(row.trust_score),
    quizScore: Number(row.quiz_score || 0),
    reliability: row.reliability_score,
    completedSessions: row.completed_sessions,
    cancelledSessions: row.cancelled_sessions,
    country: row.country,
    state: row.state,
    city: row.city
  }));

  const matches = rankMatches(input, candidates);
  const skillResult = await query<{ id: string }>('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [input.skill]);
  if (skillResult.rows[0]) {
    for (const match of matches) {
      await query(
        `INSERT INTO match_results
         (learner_id, teacher_id, skill_id, skill_match_score, level_score, trust_score, rating_score, language_score, availability_score, location_score, quiz_score, final_match_score, match_reason)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [request.auth!.userId, match.id, skillResult.rows[0].id, match.breakdown.skill, match.breakdown.level, match.breakdown.trust, match.breakdown.rating, match.breakdown.language, match.breakdown.availability, match.breakdown.location, match.breakdown.quiz, match.matchScore, match.reasons.join(' ')]
      );
    }
  }
  response.json({ matches });
}
