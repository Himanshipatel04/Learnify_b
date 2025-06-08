import { Router } from "express";
import { generateDescription } from "../controllers/gemini.controller";

export const geminiRouter = Router();                  

geminiRouter.post("/better-description", generateDescription);