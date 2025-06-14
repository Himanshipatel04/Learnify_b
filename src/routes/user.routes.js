import { Router } from 'express';
import { requireRole } from '../middlewares/auth.middleware';
import { applyForMentorship, updateProfile } from '../controllers/user.controller';

export const userRouter = Router();


userRouter.get('/apply-for-mentorship', requireRole(['user']), applyForMentorship) 
userRouter.put('/update-profile', requireRole(['user']), updateProfile);