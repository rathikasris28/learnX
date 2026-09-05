import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { startQuiz, submitQuiz, getQuizResult } from '../services/quizService.js';

const levelSchema = z.enum(['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']);

export async function start(request: AuthRequest, response: Response) {
  const input = z.object({ skill: z.string().trim().min(1).max(120), level: levelSchema }).parse(request.body);
  response.status(201).json(await startQuiz(request.auth!.userId, input.skill, input.level));
}

export async function submit(request: AuthRequest, response: Response) {
  const input = z.object({ attemptId: z.string().uuid(), answers: z.array(z.number().int().nonnegative()).max(20) }).parse(request.body);
  response.json(await submitQuiz(request.auth!.userId, input.attemptId, input.answers));
}

export async function result(request: AuthRequest, response: Response) {
  const attemptId = z.string().uuid().parse(request.params.attemptId);
  response.json({ result: await getQuizResult(request.auth!.userId, attemptId) });
}
