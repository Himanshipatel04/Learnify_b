import BlogModel from '../models/blog.model.js';

// Create a new blog
export const createBlog = async (req, res) => {
    try {
        const { title, content, tags, coverImage } = req.body;
        const postedBy = req.user._id; // Assuming user is added by auth middleware

        const blog = await BlogModel.create({ title, content, postedBy, tags, coverImage });
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create blog', details: err.message });
    }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find().populate('postedBy', 'name email');
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id).populate('postedBy', 'name email');
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
};

// Update blog
export const updateBlog = async (req, res) => {
    try {
        const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
};

// Delete blog
export const deleteBlog = async (req, res) => {
    try {
        const blog = await BlogModel.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};

export const getBlogsByUser = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user is added by auth middleware
        const blogs = await BlogModel.find({ postedBy: userId }).populate('postedBy', 'name email');

        if (!blogs || blogs.length === 0) {
            return res.status(200).json({ error: 'No blogs found!' });
        }

        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user blogs', details: err.message });
    }
}                                                       