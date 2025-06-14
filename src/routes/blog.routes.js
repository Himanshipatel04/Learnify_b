import { Router } from 'express';
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogsByUser,
} from '../controllers/blog.controller.js';
import { requireRole } from '../middlewares/auth.middleware.js';

export const blogRouter = Router();

blogRouter.get('/by-user', requireRole(['user', 'mentor']), getBlogsByUser); 
blogRouter.post('/', requireRole(['user', 'mentor']), createBlog);
blogRouter.get('/:id', requireRole(['user', 'mentor']), getBlogById);
blogRouter.get('/', requireRole(['user', 'mentor']), getAllBlogs);
blogRouter.put('/:id', requireRole(['user', 'mentor']), updateBlog);
blogRouter.delete('/:id', requireRole(['user', 'mentor']), deleteBlog);

