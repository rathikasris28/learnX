import { Router } from 'express';
import { getMe, login, register, resendVerification, verifyEmail } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const authRoutes = Router();
authRoutes.post('/register', asyncHandler(register));
authRoutes.post('/login', asyncHandler(login));
authRoutes.post('/verify-email', asyncHandler(verifyEmail));
authRoutes.post('/resend-verification', asyncHandler(resendVerification));
authRoutes.get('/me', authenticate, asyncHandler(getMe));
