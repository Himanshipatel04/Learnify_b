import { Router } from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, searchProjects } from "../controllers/project.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

export const projectRouter = Router();

projectRouter.post("/", requireRole(["user", "mentor", "admin"]), createProject);
projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.put("/:id", requireRole(["user", "mentor", "admin"]), updateProject);
projectRouter.delete("/:id", requireRole(["user", "mentor", "admin"]), deleteProject);
projectRouter.get('/search', searchProjects);