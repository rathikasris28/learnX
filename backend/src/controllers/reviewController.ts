import { Response } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { analyzeReview } from '../services/reviewAnalysisService.js';
import { recalculateTrustScore } from '../services/trustScoreService.js';

export async function createReview(request: AuthRequest, response: Response) {
  const input = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().max(2000).optional() }).parse(request.body);
  const sentiment = analyzeReview(input.comment);
  const trainerId = await withTransaction(async (client) => {
    const session = await client.query<{ trainer_id: string }>(
      `SELECT trainer_id FROM learning_sessions
       WHERE id = $1 AND learner_id = $2 AND status = 'completed' FOR UPDATE`,
      [request.params.id, request.auth!.userId]
    );
    if (!session.rowCount) throw Object.assign(new Error('Completed session not found'), { statusCode: 404 });
    await client.query(
      `INSERT INTO reviews (session_id, reviewer_id, trainer_id, rating, review, sentiment_score)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [request.params.id, request.auth!.userId, session.rows[0].trainer_id, input.rating, input.comment || null, sentiment.score]
    );
    await client.query(
      `UPDATE users SET rating = ratings.average_rating, updated_at = NOW()
       FROM (SELECT trainer_id, AVG(rating)::numeric(3,2) AS average_rating FROM reviews WHERE trainer_id = $1 GROUP BY trainer_id) ratings
       WHERE users.id = ratings.trainer_id`,
      [session.rows[0].trainer_id]
    );
    return session.rows[0].trainer_id;
  }).catch((error: unknown) => {
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      throw Object.assign(new Error('This session already has a review'), { statusCode: 409 });
    }
    throw error;
  });
  const trust = await recalculateTrustScore(trainerId);
  response.status(201).json({ sentiment, trust });
}
