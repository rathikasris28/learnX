import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { query, withTransaction } from '../config/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { sendVerificationCode } from '../services/emailService.js';
import { allowCodeRequest, allowVerificationAttempt } from '../services/otpRateLimitService.js';

const roleSchema = z.enum(['learner', 'teacher', 'both']);
const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
  role: roleSchema,
  country: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  languages: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  skillsLearning: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  skillsTeaching: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  learningGoal: z.string().trim().max(160).optional(),
  learningLevel: z.enum(['Beginner', 'Elementary', 'Intermediate', 'Advanced']).optional(),
  teachingLevel: z.enum(['Intermediate', 'Advanced', 'Expert']).optional(),
  teachingStyles: z.array(z.string().trim().max(80)).max(20).default([]),
  availability: z.array(z.string().trim().max(80)).max(20).default([]),
  termsAccepted: z.literal(true),
  termsVersion: z.string().max(20).default('1.0')
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72)
});

const verifySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().regex(/^\d{6}$/)
});

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'teacher' | 'both' | 'admin';
  avatar: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  languages: string[];
  learning_goal: string | null;
  learning_level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | null;
  teaching_level: 'Intermediate' | 'Advanced' | 'Expert' | null;
  bio: string;
  is_email_verified: boolean;
  terms_accepted: boolean;
  terms_version: string | null;
  terms_accepted_at: string | null;
  time_credits: number;
  total_earned_credits: number;
  total_used_credits: number;
  rating: number;
  reliability_score: number;
  trust_score: number;
  created_at: string;
};

async function publicUser(user: UserRow) {
  const skills = await query<{ name: string; direction: 'learn' | 'teach' }>(
    `SELECT s.name, us.direction FROM user_skills us JOIN skills s ON s.id = us.skill_id WHERE us.user_id = $1`,
    [user.id]
  );
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    country: user.country,
    state: user.state,
    city: user.city,
    languages: user.languages,
    learningLevel: user.learning_level || undefined,
    teachingLevel: user.teaching_level || undefined,
    learningGoal: user.learning_goal || undefined,
    bio: user.bio,
    isEmailVerified: user.is_email_verified,
    termsAccepted: user.terms_accepted,
    termsVersion: user.terms_version,
    termsAcceptedDate: user.terms_accepted_at,
    timeCredits: user.time_credits,
    totalEarnedCredits: user.total_earned_credits,
    totalUsedCredits: user.total_used_credits,
    rating: Number(user.rating),
    reliabilityScore: user.reliability_score,
    trustScore: user.trust_score,
    joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    skillsLearning: skills.rows.filter((skill) => skill.direction === 'learn').map((skill) => skill.name),
    skillsTeaching: skills.rows.filter((skill) => skill.direction === 'teach').map((skill) => skill.name)
  };
}

function createToken(user: Pick<UserRow, 'id' | 'role'>) {
  return jwt.sign({ role: user.role, tokenType: 'access' }, env.JWT_SECRET, {
    algorithm: 'HS256',
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  });
}

function createOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

async function issueVerificationCode(userId: string, email: string) {
  const code = createOtp();
  await withTransaction(async (client) => {
    await client.query('DELETE FROM email_verification_codes WHERE user_id = $1 AND used_at IS NULL', [userId]);
    await client.query(
      `INSERT INTO email_verification_codes (user_id, code_hash, expires_at)
       VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 minute'))`,
      [userId, hashOtp(code), env.OTP_EXPIRES_MINUTES]
    );
  });
  await sendVerificationCode(email, code);
}

export async function resendVerification(request: Request, response: Response) {
  const input = z.object({ email: z.string().trim().toLowerCase().email() }).parse(request.body);
  if (!allowCodeRequest(input.email, request.ip || 'unknown')) {
    response.status(429).json({ error: 'Too many verification code requests. Please try again later.' });
    return;
  }
  const result = await query<Pick<UserRow, 'id' | 'email' | 'is_email_verified'>>(
    'SELECT id, email, is_email_verified FROM users WHERE email = $1',
    [input.email]
  );
  const user = result.rows[0];
  if (!user || user.is_email_verified) {
    response.json({ message: 'If the account needs verification, a new code has been sent' });
    return;
  }
  await issueVerificationCode(user.id, user.email);
  response.json({ message: 'A new verification code has been sent' });
}

export async function register(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);
  if (!allowCodeRequest(input.email, request.ip || 'unknown')) {
    response.status(429).json({ error: 'Too many verification code requests. Please try again later.' });
    return;
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const starterCredits = input.role === 'teacher' ? 0 : 5;

  const user = await withTransaction(async (client) => {
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [input.email]);
    if (existing.rowCount) {
      response.status(409).json({ error: 'An account with this email already exists' });
      return null;
    }

    const result = await client.query<UserRow>(
      `INSERT INTO users
      (name, email, password_hash, role, country, state, city, languages, learning_goal, learning_level, teaching_level, teaching_styles, availability, terms_accepted, terms_version, terms_accepted_at, time_credits)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, TRUE, $14, NOW(), $15)
       RETURNING *`,
          [input.name, input.email, passwordHash, input.role, input.country ?? null, input.state ?? null, input.city ?? null, input.languages, input.learningGoal ?? null, input.learningLevel ?? null, input.teachingLevel ?? null, input.teachingStyles, input.availability, input.termsVersion, starterCredits]
    );

    const skillNames = [...new Set([...input.skillsLearning, ...input.skillsTeaching])];
    for (const skillName of skillNames) {
      const skillResult = await client.query<{ id: string }>('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [skillName]);
      const skill = skillResult.rows[0];
      if (!skill) continue;
      if (input.skillsLearning.includes(skillName)) {
        await client.query(
          `INSERT INTO user_skills (user_id, skill_id, direction, level) VALUES ($1, $2, 'learn', $3) ON CONFLICT DO NOTHING`,
          [result.rows[0].id, skill.id, input.learningLevel ?? 'Beginner']
        );
      }
      if (input.skillsTeaching.includes(skillName)) {
        await client.query(
          `INSERT INTO user_skills (user_id, skill_id, direction, level) VALUES ($1, $2, 'teach', $3) ON CONFLICT DO NOTHING`,
          [result.rows[0].id, skill.id, input.teachingLevel ?? 'Advanced']
        );
      }
    }

    if (starterCredits > 0) {
      await client.query(
        `INSERT INTO wallet_transactions (user_id, type, amount, reason)
         VALUES ($1, 'starter', $2, 'LearnX starter credits')`,
        [result.rows[0].id, starterCredits]
      );
    }
    return result.rows[0];
  });

  if (!user) return;
  await issueVerificationCode(user.id, user.email);
  response.status(201).json({ user: await publicUser(user), token: createToken(user), verificationRequired: true });
}

export async function login(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);
  const result = await query<UserRow & { password_hash: string }>('SELECT * FROM users WHERE email = $1', [input.email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
    response.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  if (!allowCodeRequest(input.email, request.ip || 'unknown')) {
    response.status(429).json({ error: 'Too many verification code requests. Please try again later.' });
    return;
  }
  await issueVerificationCode(user.id, user.email);
  response.json({ user: await publicUser(user), token: createToken(user), verificationRequired: true });
}

export async function verifyEmail(request: Request, response: Response) {
  const input = verifySchema.parse(request.body);
  if (!allowVerificationAttempt(input.email, request.ip || 'unknown')) {
    response.status(429).json({ error: 'Too many verification attempts. Please try again later.' });
    return;
  }
  const result = await query<UserRow>('SELECT * FROM users WHERE email = $1', [input.email]);
  const user = result.rows[0];
  if (!user) {
    response.status(400).json({ error: 'Invalid verification request' });
    return;
  }

  const verified = await withTransaction(async (client) => {
    const codeResult = await client.query<{ id: string; code_hash: string; attempts: number }>(
      `SELECT id, code_hash, attempts FROM email_verification_codes
       WHERE user_id = $1 AND used_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1 FOR UPDATE`,
      [user.id]
    );
    const code = codeResult.rows[0];
    if (!code || code.attempts >= 5) return false;

    const matches = code.code_hash === hashOtp(input.code);
    if (!matches) {
      await client.query('UPDATE email_verification_codes SET attempts = attempts + 1 WHERE id = $1', [code.id]);
      return false;
    }

    await client.query('UPDATE users SET is_email_verified = TRUE, updated_at = NOW() WHERE id = $1', [user.id]);
    await client.query('UPDATE email_verification_codes SET used_at = NOW() WHERE id = $1', [code.id]);
    return true;
  });
  if (!verified) {
    response.status(400).json({ error: 'The verification code is invalid or expired' });
    return;
  }
  response.json({ message: 'Email verified successfully' });
}

export async function getMe(request: AuthRequest, response: Response) {
  const result = await query<UserRow>('SELECT * FROM users WHERE id = $1', [request.auth?.userId]);
  const user = result.rows[0];
  if (!user) {
    response.status(404).json({ error: 'User not found' });
    return;
  }
  response.json({ user: await publicUser(user) });
}
