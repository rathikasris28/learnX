import crypto from 'node:crypto';
import { Request, Response } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const createSessionSchema = z.object({
  trainerId: z.string().uuid(),
  skill: z.string().trim().min(1).max(120),
  topic: z.string().trim().min(2).max(200),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  learningGoal: z.string().trim().min(2).max(500)
}).refine((value) => value.endsAt > value.startsAt, {
  message: 'Session end time must be after its start time',
  path: ['endsAt']
});

const idSchema = z.object({ id: z.string().uuid() });

export async function createSession(request: AuthRequest, response: Response) {
  const input = createSessionSchema.parse(request.body);
  const learnerId = request.auth!.userId;
  if (learnerId === input.trainerId) {
    response.status(400).json({ error: 'You cannot book a session with yourself' });
    return;
  }

  const session = await withTransaction(async (client) => {
    const learnerResult = await client.query<{ time_credits: number }>(
      'SELECT time_credits FROM users WHERE id = $1 FOR UPDATE',
      [learnerId]
    );
    const trainerResult = await client.query<{ id: string }>(
      `SELECT id FROM users WHERE id = $1 AND role IN ('teacher', 'both') AND is_email_verified = TRUE`,
      [input.trainerId]
    );
    if (!learnerResult.rowCount) throw Object.assign(new Error('Learner account not found'), { statusCode: 404 });
    if (!trainerResult.rowCount) throw Object.assign(new Error('Verified trainer not found'), { statusCode: 404 });
    if ((learnerResult.rows[0].time_credits || 0) < 1) {
      throw Object.assign(new Error('Insufficient Time Credits'), { statusCode: 409 });
    }

    const conflict = await client.query(
      `SELECT id FROM learning_sessions
       WHERE trainer_id = $1 AND status IN ('scheduled', 'in-progress')
       AND starts_at < $3 AND ends_at > $2
       LIMIT 1`,
      [input.trainerId, input.startsAt, input.endsAt]
    );
    if (conflict.rowCount) throw Object.assign(new Error('The trainer is unavailable for that time'), { statusCode: 409 });

    const skillResult = await client.query<{ id: string }>('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [input.skill]);
    if (!skillResult.rowCount) throw Object.assign(new Error('Skill does not exist'), { statusCode: 400 });

    const meetingRoomId = `learnx-${input.skill.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${crypto.randomBytes(5).toString('hex')}`;
    const created = await client.query(
      `INSERT INTO learning_sessions
       (learner_id, trainer_id, skill_id, topic, starts_at, ends_at, meeting_room_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, learner_id, trainer_id, skill_id, topic, starts_at, ends_at, status, meeting_room_id`,
      [learnerId, input.trainerId, skillResult.rows[0].id, input.topic, input.startsAt, input.endsAt, meetingRoomId]
    );
    await client.query(
      `UPDATE users SET time_credits = time_credits - 1, total_used_credits = total_used_credits + 1, updated_at = NOW() WHERE id = $1`,
      [learnerId]
    );
    await client.query(
      `INSERT INTO wallet_transactions (user_id, session_id, type, amount, reason)
       VALUES ($1, $2, 'used', -1, $3)`,
      [learnerId, created.rows[0].id, `Booked ${input.skill} session`]
    );
    return created.rows[0];
  });

  response.status(201).json({ session });
}

export async function listSessions(request: AuthRequest, response: Response) {
  const result = await query(
    `SELECT ls.*, learner.name AS learner_name, trainer.name AS trainer_name, skill.name AS skill_name
     FROM learning_sessions ls
     JOIN users learner ON learner.id = ls.learner_id
     JOIN users trainer ON trainer.id = ls.trainer_id
     LEFT JOIN skills skill ON skill.id = ls.skill_id
     WHERE ls.learner_id = $1 OR ls.trainer_id = $1
     ORDER BY ls.starts_at DESC`,
    [request.auth!.userId]
  );
  response.json({ sessions: result.rows });
}

async function updateSessionStatus(request: AuthRequest, response: Response, status: 'cancelled' | 'completed') {
  const { id } = idSchema.parse(request.params);
  const result = await query<{ id: string; status: string }>(
    `UPDATE learning_sessions SET status = $1
     WHERE id = $2 AND (learner_id = $3 OR trainer_id = $3) AND status IN ('scheduled', 'in-progress')
     RETURNING id, status`,
    [status, id, request.auth!.userId]
  );
  if (!result.rowCount) {
    response.status(404).json({ error: 'Session not found or cannot be updated' });
    return;
  }
  response.json({ session: result.rows[0] });
}

export async function cancelSession(request: AuthRequest, response: Response) {
  await updateSessionStatus(request, response, 'cancelled');
}

export async function completeSession(request: AuthRequest, response: Response) {
  await updateSessionStatus(request, response, 'completed');
}
