import express from "express";
import {  toggleLikeProject,toggleLikeBlog,toggleLikeIdea } from "../controllers/like.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

export const likeRouter = express.Router();

likeRouter.post("/:id/like", requireRole(['user', 'mentor', 'admin']), toggleLikeProject);
likeRouter.post("/blog/:id/like", requireRole(['user', 'mentor', 'admin']), toggleLikeBlog);                                 
likeRouter.post("/idea/:id/like", requireRole(['user', 'mentor', 'admin']), toggleLikeIdea);                 


