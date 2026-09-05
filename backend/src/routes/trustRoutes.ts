import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getTrust, recalculateTrust } from '../controllers/trustController.js';

export const trustRoutes = Router();
trustRoutes.post('/recalculate', authenticate, asyncHandler(recalculateTrust));
trustRoutes.get('/:userId', authenticate, asyncHandler(getTrust));
