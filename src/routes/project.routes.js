import { Router } from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, searchProjects, getProjectsByUser } from "../controllers/project.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

export const projectRouter = Router();

projectRouter.get('/by-user',requireRole(['admin','user','mentor']),getProjectsByUser)
projectRouter.post("/", requireRole(["user", "mentor", "admin"]),upload.single("image"), createProject);
projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.put("/:id", requireRole(["user", "mentor", "admin"]), updateProject);
projectRouter.delete("/:id", requireRole(["user", "mentor", "admin"]), deleteProject);
projectRouter.get('/search', searchProjects);