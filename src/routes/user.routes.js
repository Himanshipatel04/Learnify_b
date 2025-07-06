import { Router } from 'express';
import { requireRole } from '../middlewares/auth.middleware';
import { applyForMentorship, getMentorsByPagination, getTopMentors, getUserProfile, getUserProfileData, togglePrivacy, updateProfile } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/mentors', getMentorsByPagination)
userRouter.get('/top-mentors', getTopMentors)
userRouter.put('/toggle-profile-privacy', requireRole(['user']), togglePrivacy)
userRouter.put('/update-profile', requireRole(['user']), updateProfile);
userRouter.put('/apply-for-mentor/:userId', applyForMentorship);
userRouter.get('/get-user-profile/:userId', requireRole(['user', 'admin', 'mentor']), getUserProfileData);             
userRouter.get('/:userId', requireRole(['user', 'admin']), getUserProfile);
