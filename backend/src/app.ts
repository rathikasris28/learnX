import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { matchingRoutes } from './routes/matchingRoutes.js';
import { skillRoutes } from './routes/skillRoutes.js';
import { sessionRoutes } from './routes/sessionRoutes.js';
import { trustRoutes } from './routes/trustRoutes.js';
import { quizRoutes } from './routes/quizRoutes.js';

export const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'learnx-api', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api/quiz', quizRoutes);

app.use((error: unknown, request: express.Request, response: express.Response, next: express.NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
    return;
  }
  next(error);
});

app.use(errorMiddleware);
