import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { query } from '../config/database.js';
import { recalculateTrustScore } from '../services/trustScoreService.js';

export async function getTrust(request: AuthRequest, response: Response) {
  const userId = z.string().uuid().parse(request.params.userId);
  const result = await query('SELECT * FROM trust_scores WHERE user_id = $1', [userId]);
  response.json({ trust: result.rows[0] || await recalculateTrustScore(userId) });
}

export async function recalculateTrust(request: AuthRequest, response: Response) {
  const body = z.object({ userId: z.string().uuid().optional() }).parse(request.body);
  const userId = body.userId || request.auth!.userId;
  response.json({ trust: await recalculateTrustScore(userId) });
}
