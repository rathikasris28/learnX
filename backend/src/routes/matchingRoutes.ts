import { Router } from 'express';
import { getMatches } from '../controllers/matchingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getMatchReport } from '../controllers/matchReportController.js';

export const matchingRoutes = Router();
matchingRoutes.post('/', authenticate, asyncHandler(getMatches));
matchingRoutes.get('/recommendations', authenticate, asyncHandler(getMatches));
matchingRoutes.post('/analyze', authenticate, asyncHandler(getMatches));
matchingRoutes.get('/report/:teacherId', authenticate, asyncHandler(getMatchReport));
