import express from "express";
import { getProjectLikeCount, toggleLikeProject } from "../controllers/like.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

export const likeRouter = express.Router();

likeRouter.post("/:id/like", requireRole(['user', 'mentor', 'admin']), toggleLikeProject);
likeRouter.get("/:id/like", requireRole(['user', 'mentor', 'admin']), getProjectLikeCount);


