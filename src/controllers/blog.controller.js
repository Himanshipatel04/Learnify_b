import BlogModel from '../models/blog.model.js';
import mongoose from "mongoose";
import CommentModel from '../models/comment.model.js';
import LikeModel from '../models/like.model.js';

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
    const blogId = new mongoose.Types.ObjectId(req.params.id);

    const blogAggregate = await BlogModel.aggregate([
      { $match: { _id: blogId } },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
        },
      },
      { $unwind: "$postedBy" },
      {
        $lookup: {
          from: "likes",
          let: { blogId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$blog", "$$blogId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "likedBy",
              },
            },
            { $unwind: "$likedBy" },
          ],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { blogId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$blog", "$$blogId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "commentedBy",
                foreignField: "_id",
                as: "commentedBy",
              },
            },
            { $unwind: "$commentedBy" },
          ],
          as: "comments",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
        },
      },
    ]);

    const blog = blogAggregate[0];

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const hasLiked =
      req.user && req.user._id
        ? blog.likes.some((like) => like.likedBy._id.toString() === req.user._id.toString())
        : false;

    console.log(blog)
    res.json({ ...blog, hasLiked });
  } catch (err) {
    console.error("Error fetching blog with aggregation:", err);
    res.status(500).json({ error: "Error fetching blog" });
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

export const getBlogsByPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const blogs = await BlogModel.find()
      .populate("postedBy", "name role picture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const blogIds = blogs.map((b) => b._id);

    const [likeCounts, commentCounts] = await Promise.all([
      LikeModel.aggregate([
        { $match: { blog: { $in: blogIds } } },
        { $group: { _id: "$blog", count: { $sum: 1 } } },
      ]),
      CommentModel.aggregate([
        { $match: { blog: { $in: blogIds } } }, // ✅ Corrected field
        { $group: { _id: "$blog", count: { $sum: 1 } } },
      ]),
    ]);

    const likesMap = Object.fromEntries(likeCounts.map((l) => [l._id.toString(), l.count]));
    const commentsMap = Object.fromEntries(commentCounts.map((c) => [c._id.toString(), c.count]));

    const enrichedBlogs = blogs.map((blog) => {
      const id = blog._id.toString();
      return {
        ...blog.toObject(),
        likeCount: likesMap[id] || 0,
        commentCount: commentsMap[id] || 0,
      };
    });

    const totalBlogs = await BlogModel.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      blogs: enrichedBlogs,
      totalBlogs,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching blogs by pagination:", error);
    res.status(500).json({ error: "Failed to fetch blogs by pagination" });
  }
};
