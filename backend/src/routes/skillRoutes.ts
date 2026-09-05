import { Router } from 'express';
import { listCategories, listDomains, listSkills } from '../controllers/skillController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const skillRoutes = Router();
skillRoutes.get('/', asyncHandler(listSkills));
skillRoutes.get('/categories', asyncHandler(listCategories));
skillRoutes.get('/domains', asyncHandler(listDomains));
