import { Router } from 'express';
import { requireRole } from '../middlewares/auth.middleware';
import { applyForMentorship, getUserProfile, getUserProfileData, updateProfile } from '../controllers/user.controller';

export const userRouter = Router();


userRouter.get('/:userId', requireRole(['user', 'admin']), getUserProfile); 
userRouter.get('/get-user-profile/:userId', requireRole(['user']), getUserProfileData);             
userRouter.get('/apply-for-mentorship', requireRole(['user']), applyForMentorship) 
userRouter.put('/update-profile', requireRole(['user']), updateProfile);