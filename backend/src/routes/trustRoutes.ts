import { Router } from 'express';
import { authenticate, requireRoles } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getTrust, recalculateTrust } from '../controllers/trustController.js';

export const trustRoutes = Router();
trustRoutes.post('/recalculate', authenticate, requireRoles('admin'), asyncHandler(recalculateTrust));
trustRoutes.get('/:userId', authenticate, asyncHandler(getTrust));
