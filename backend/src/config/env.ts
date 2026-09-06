import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { z } from 'zod';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().trim().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ISSUER: z.string().trim().min(1).default('learnx-api'),
  JWT_AUDIENCE: z.string().trim().min(1).default('learnx-web'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OTP_EXPIRES_MINUTES: z.coerce.number().int().positive().default(10),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional()
});

export const env = envSchema.parse(process.env);
