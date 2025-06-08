import { Router } from 'express';
import { requireRole } from '../middlewares/auth.middleware';
import { applyForMentorship } from '../controllers/user.controller';

export const userRouter = Router();


userRouter.get('/apply-for-mentorship', requireRole(['user']), applyForMentorship) 