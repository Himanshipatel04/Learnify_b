import { Router } from "express";
import { requireRole } from "../middlewares/auth.middleware";
import { getFigures } from "../controllers/admin.controller.js";            

const adminRouter = Router();        

adminRouter.get('/getFigures',requireRole(['admin']),getFigures)

