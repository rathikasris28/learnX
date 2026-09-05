import { Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { analyzeReview } from '../services/reviewAnalysisService.js';
import { recalculateTrustScore } from '../services/trustScoreService.js';

export async function createReview(request: AuthRequest, response: Response) {
  const input = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().max(2000).optional() }).parse(request.body);
  const session = await query<{ trainer_id: string }>(
    `SELECT trainer_id FROM learning_sessions WHERE id = $1 AND learner_id = $2 AND status = 'completed'`,
    [request.params.id, request.auth!.userId]
  );
  if (!session.rowCount) {
    response.status(404).json({ error: 'Completed session not found' });
    return;
  }
  const existing = await query('SELECT id FROM reviews WHERE session_id = $1', [request.params.id]);
  if (existing.rowCount) {
    response.status(409).json({ error: 'This session already has a review' });
    return;
  }
  const sentiment = analyzeReview(input.comment);
  await query(
    `INSERT INTO reviews (session_id, reviewer_id, trainer_id, rating, review, sentiment_score)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [request.params.id, request.auth!.userId, session.rows[0].trainer_id, input.rating, input.comment || null, sentiment.score]
  );
  const trust = await recalculateTrustScore(session.rows[0].trainer_id);
  response.status(201).json({ sentiment, trust });
}
