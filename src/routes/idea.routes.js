import { Router } from 'express';
import {
  getAllIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
  getIdeaById,
  searchIdeas
} from '../controllers/idea.controller.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const ideaRouter = Router();

// Create a new idea
ideaRouter.post('/', requireRole(["user", "mentor", "admin"]), createIdea);

// Get all ideas
ideaRouter.get('/', requireRole(["user", "mentor", "admin"]), getAllIdeas);

// Get idea by ID
ideaRouter.get('/:id', requireRole(["user", "mentor", "admin"]), getIdeaById);

// Update idea by ID
ideaRouter.put('/:id', requireRole(["user", "mentor", "admin"]), updateIdea);

// Delete idea by ID
ideaRouter.delete('/:id', requireRole(["user", "mentor", "admin"]), deleteIdea);

// Search ideas by query
ideaRouter.get('/search', requireRole(["user", "mentor", "admin"]), searchIdeas);

export default ideaRouter;
