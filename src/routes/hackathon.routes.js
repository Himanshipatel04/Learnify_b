import { Router } from "express";
import { requireRole } from "../middlewares/auth.middleware.js";
import {
  createHackathon,
  deleteHackathon,
  getAllHackathons,
  getHackathonById,
  getHackathonsByPagination,
  getHackathonsByUser,
  getTopHackathons,
  updateHackathon,
} from "../controllers/hackathon.controller.js";
import upload from "../middlewares/multer.middleware.js";

export const hackathonRouter = Router();

hackathonRouter.get("/top-hackathons", getTopHackathons);
hackathonRouter.get("/get-hackathons-by-pagination", getHackathonsByPagination);
hackathonRouter.get(
  "/by-user",
  requireRole(["user", "mentor"]),
  getHackathonsByUser
);
hackathonRouter.post(
  "/",
  requireRole(["user", "mentor"]),
  upload.single("image"),
  createHackathon
);
hackathonRouter.get(
  "/:id",
  requireRole(["user", "mentor", "admin"]),
  getHackathonById
);
hackathonRouter.get("/", requireRole(["user", "mentor"]), getAllHackathons);
hackathonRouter.put("/:id", requireRole(["user", "mentor"]), updateHackathon);
hackathonRouter.delete(
  "/:id",
  requireRole(["user", "mentor"]),
  deleteHackathon
);
