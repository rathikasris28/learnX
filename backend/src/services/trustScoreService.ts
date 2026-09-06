import { query } from '../config/database.js';

export interface TrustScoreBreakdown {
  emailScore: number;
  profileScore: number;
  quizScore: number;
  sessionScore: number;
  ratingScore: number;
  reviewScore: number;
  cancellationScore: number;
  finalTrustScore: number;
}

type TrustRow = {
  is_email_verified: boolean;
  profile_completed: boolean;
  completed_sessions: number;
  total_sessions: number;
  cancelled_sessions: number;
  average_rating: number | null;
  review_count: number;
  positive_reviews: number;
  best_quiz_score: number | null;
};

export async function calculateTrustScore(userId: string): Promise<TrustScoreBreakdown> {
  const result = await query<TrustRow>(
    `SELECT u.is_email_verified,
            (u.name <> '' AND u.bio <> '' AND cardinality(u.languages) > 0 AND u.country IS NOT NULL) AS profile_completed,
            COALESCE(s.completed_sessions, 0)::int AS completed_sessions,
            COALESCE(s.total_sessions, 0)::int AS total_sessions,
            COALESCE(s.cancelled_sessions, 0)::int AS cancelled_sessions,
            r.average_rating,
            COALESCE(r.review_count, 0)::int AS review_count,
            COALESCE(r.positive_reviews, 0)::int AS positive_reviews,
            q.best_quiz_score
     FROM users u
     LEFT JOIN (
       SELECT trainer_id,
              COUNT(*) FILTER (WHERE status = 'completed') AS completed_sessions,
              COUNT(*) AS total_sessions,
              COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_sessions
       FROM learning_sessions GROUP BY trainer_id
     ) s ON s.trainer_id = u.id
     LEFT JOIN (
       SELECT trainer_id, AVG(rating)::float AS average_rating,
              COUNT(*) AS review_count,
              COUNT(*) FILTER (WHERE rating >= 4) AS positive_reviews
       FROM reviews GROUP BY trainer_id
     ) r ON r.trainer_id = u.id
     LEFT JOIN (
       SELECT user_id, MAX(score)::float AS best_quiz_score
       FROM quiz_attempts WHERE completed_at IS NOT NULL GROUP BY user_id
     ) q ON q.user_id = u.id
     WHERE u.id = $1
    `,
    [userId]
  );
  const row = result.rows[0];
  if (!row) throw new Error('User not found');

  const completionRate = row.total_sessions ? row.completed_sessions / row.total_sessions : 0;
  const cancellationRate = row.total_sessions ? row.cancelled_sessions / row.total_sessions : 0;
  const emailScore = row.is_email_verified ? 10 : 0;
  const profileScore = row.profile_completed ? 10 : 0;
  const quizScore = row.best_quiz_score == null ? 0 : 15;
  const sessionScore = Math.round(completionRate * 20);
  const ratingScore = row.average_rating == null ? 0 : Math.round((row.average_rating / 5) * 15);
  const reviewScore = row.review_count ? Math.round((row.positive_reviews / row.review_count) * 10) : 0;
  const cancellationScore = Math.round(Math.max(0, 1 - cancellationRate) * 5);
  const finalTrustScore = Math.min(100, emailScore + profileScore + quizScore + sessionScore + ratingScore + reviewScore + cancellationScore);

  return { emailScore, profileScore, quizScore, sessionScore, ratingScore, reviewScore, cancellationScore, finalTrustScore };
}

export async function recalculateTrustScore(userId: string) {
  const breakdown = await calculateTrustScore(userId);
  await query(
    `INSERT INTO trust_scores (user_id, email_score, profile_score, quiz_score, session_score, rating_score, review_score, cancellation_score, final_trust_score)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (user_id) DO UPDATE SET email_score = EXCLUDED.email_score, profile_score = EXCLUDED.profile_score,
       quiz_score = EXCLUDED.quiz_score, session_score = EXCLUDED.session_score, rating_score = EXCLUDED.rating_score,
       review_score = EXCLUDED.review_score, cancellation_score = EXCLUDED.cancellation_score,
       final_trust_score = EXCLUDED.final_trust_score, updated_at = NOW()`,
    [userId, breakdown.emailScore, breakdown.profileScore, breakdown.quizScore, breakdown.sessionScore, breakdown.ratingScore, breakdown.reviewScore, breakdown.cancellationScore, breakdown.finalTrustScore]
  );
  return breakdown;
}
