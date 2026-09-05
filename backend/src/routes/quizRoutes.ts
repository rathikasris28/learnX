import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { start, submit, result } from '../controllers/quizController.js';

export const quizRoutes = Router();
quizRoutes.post('/start', authenticate, asyncHandler(start));
quizRoutes.post('/submit', authenticate, asyncHandler(submit));
quizRoutes.get('/result/:attemptId', authenticate, asyncHandler(result));
