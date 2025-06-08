import { Router } from "express";
import passport from "passport";
import { getUser, googleCallback, logoutUser } from "../controllers/auth.controller";
import { requireRole } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    googleCallback
);

authRouter.get('/user', requireRole(['user', 'admin']), getUser);
authRouter.get('/logout', logoutUser);