import { Router } from 'express';
import { cancelSession, completeSession, createSession, listSessions } from '../controllers/sessionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { createReview } from '../controllers/reviewController.js';

export const sessionRoutes = Router();
sessionRoutes.use(authenticate);
sessionRoutes.post('/', asyncHandler(createSession));
sessionRoutes.get('/', asyncHandler(listSessions));
sessionRoutes.put('/:id/cancel', asyncHandler(cancelSession));
sessionRoutes.put('/:id/complete', asyncHandler(completeSession));
sessionRoutes.post('/:id/review', asyncHandler(createReview));
