import { Router } from "express";
import { createProject, getProjectById, updateProject, deleteProject, searchProjects, getProjectsByUser, getProjectsByPagination, getProjectsByDomain } from "../controllers/project.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

export const projectRouter = Router();

projectRouter.get('/get-projects-by-pagination', getProjectsByPagination);
projectRouter.get('/by-user', requireRole(['admin', 'user', 'mentor']), getProjectsByUser)
projectRouter.post("/", requireRole(["user", "mentor", "admin"]), upload.single("image"), createProject);;
projectRouter.get('/search', searchProjects);
projectRouter.get("/:id", requireRole(['user', 'mentor', 'admin']), getProjectById);
projectRouter.put("/:id", requireRole(["user", "mentor", "admin"]), updateProject);
projectRouter.delete("/:id", requireRole(["user", "mentor", "admin"]), deleteProject);
projectRouter.get('/get-projects-by-domain/:domain', getProjectsByDomain)