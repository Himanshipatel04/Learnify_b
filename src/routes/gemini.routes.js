import { Router } from "express";
import { generateDescription } from "../controllers/gemini.controller";
import { requireRole } from "../middlewares/auth.middleware";
import { geminiLimiter } from "../middlewares/ratelimiter.middleware";

export const geminiRouter = Router();                  

geminiRouter.post("/better-description",requireRole(['user','mentor']), geminiLimiter ,generateDescription);