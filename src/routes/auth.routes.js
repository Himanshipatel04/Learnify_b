import { Router } from "express";
import passport from "passport";
import { getUser, googleCallback, logoutUser, registerUser,loginUser } from "../controllers/auth.controller";
import { requireRole } from "../middlewares/auth.middleware";


export const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    googleCallback
);

authRouter.get('/user', requireRole(['user', 'admin']), getUser);

authRouter.post('/register',registerUser);  

authRouter.post('/login', loginUser)

authRouter.get('/logout',requireRole(['user','admin','mentor']), logoutUser);