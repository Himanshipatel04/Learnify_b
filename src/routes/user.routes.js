import { Router } from 'express';
import { requireRole } from '../middlewares/auth.middleware';
import { applyForMentorship, getUserProfile, getUserProfileData, togglePrivacy, updateProfile } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.put('/toggle-profile-privacy', requireRole(['user']), togglePrivacy)
userRouter.put('/update-profile', requireRole(['user']), updateProfile);
userRouter.put('/apply-for-mentor/:userId', applyForMentorship);
userRouter.get('/:userId', requireRole(['user', 'admin']), getUserProfile);
userRouter.get('/get-user-profile/:userId', requireRole(['user']), getUserProfileData);             
