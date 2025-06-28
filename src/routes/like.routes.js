import express from "express";
import {  toggleLikeProject } from "../controllers/like.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

export const likeRouter = express.Router();

likeRouter.post("/:id/like", requireRole(['user', 'mentor', 'admin']), toggleLikeProject);


