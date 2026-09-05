import { Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { recalculateTrustScore } from '../services/trustScoreService.js';

export async function getMatchReport(request: AuthRequest, response: Response) {
  const teacherId = z.string().uuid().parse(request.params.teacherId);
  const teacher = await query(
    `SELECT u.id, u.name, u.bio, u.languages, u.country, u.state, u.city, u.rating,
            COALESCE(ts.final_trust_score, u.trust_score, 0)::float AS trust_score,
            COALESCE(json_agg(DISTINCT jsonb_build_object('name', sk.name, 'level', us.level)) FILTER (WHERE sk.id IS NOT NULL), '[]') AS skills,
            COUNT(DISTINCT r.id)::int AS reviews_count,
            COALESCE(AVG(r.rating), 0)::float AS average_rating
     FROM users u
     LEFT JOIN trust_scores ts ON ts.user_id = u.id
     LEFT JOIN user_skills us ON us.user_id = u.id AND us.direction = 'teach'
     LEFT JOIN skills sk ON sk.id = us.skill_id
     LEFT JOIN reviews r ON r.trainer_id = u.id
     WHERE u.id = $1 AND u.role IN ('teacher', 'both')
     GROUP BY u.id, ts.final_trust_score`,
    [teacherId]
  );
  if (!teacher.rowCount) {
    response.status(404).json({ error: 'Knowledge Sharer not found' });
    return;
  }
  const trust = await recalculateTrustScore(teacherId);
  response.json({ report: { ...teacher.rows[0], trust, explanation: 'This report is based on verified profile, skill, trust, review, language, location, availability, and session performance data.' } });
}
