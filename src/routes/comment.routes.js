import express from "express";
import { deleteComment, addComment, getCommentsByProject } from "../controllers/comment.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

export const commentRouter = express.Router();

commentRouter.post("/:projectId/comments", requireRole(["user", "mentor", "admin"]), addComment);
commentRouter.get("/:projectId/comments", requireRole(["user", "mentor", "admin"]), getCommentsByProject);
commentRouter.delete("/:commentId", requireRole(["user", "mentor", "admin"]), deleteComment);

