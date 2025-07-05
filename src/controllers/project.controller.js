// src/controllers/project.controller.js
import ProjectModel from "../models/project.model.js";
import LikeModel from "../models/like.model.js";
import CommentModel from "../models/comment.model.js";
import mongoose from "mongoose";

export const createProject = async (req, res) => {
  try {
    const imageUrl = req.file?.path || "";

    const project = await ProjectModel.create({
      ...req.body,
      image: imageUrl,
      postedBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project", details: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectId = new mongoose.Types.ObjectId(req.params.id);

    const projectAggregate = await ProjectModel.aggregate([
      { $match: { _id: projectId } },
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
          let: { projectId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$project", "$$projectId"] } } },
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
          let: { projectId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$project", "$$projectId"] } } },
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

    const project = projectAggregate[0];

    if (!project) return res.status(404).json({ error: "Project not found" });

    // check if user has liked
    const hasLiked =
      req.user && req.user._id
        ? project.likes.some((like) => like.likedBy._id.toString() === req.user._id.toString())
        : false;

    res.json({ ...project, hasLiked });
  } catch (err) {
    console.error("Error fetching project with aggregation:", err);
    res.status(500).json({ error: "Error fetching project" });
  }
};


export const updateProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    if (
      req.user.role !== "admin" &&
      project.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log("Error updating project:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    if (
      req.user.role !== "admin" &&
      project.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.log("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

export const searchProjects = async (req, res) => {
  const { query } = req.query;

  if (!query?.trim()) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const projects = await ProjectModel.aggregate([
      {
        $search: {
          index: "project_index",
          text: {
            query,
            path: {
              wildcard: "*"
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy"
        }
      },
      { $unwind: "$postedBy" },
      {
        $project: {
          title: 1,
          domain: 1,
          abstract: 1,
          description: 1,
          image: 1,
          createdAt: 1,
          tags: 1,
          postedBy: { name: 1, picture: 1 }
        }
      }
    ]);
    res.status(200).json({ projects: projects });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: 'Search failed', error });
  }
};

export const getProjectsByUser = async (req, res) => {
  try {
    // console.log(req.user," User fetching projects");        
    const projects = await ProjectModel.find({ postedBy: req.user._id })
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(200).json({ message: "No projects found!" });
    }

    res.json(projects);
  } catch (err) {
    console.log("Error fetching user projects:", err);
    res.status(500).json({ error: "Failed to fetch user projects" });
  }
}

export const getProjectsByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    if (!domain) return res.status(400).json({ error: "Domain is required" });

    const projects = await ProjectModel.find({ domain })
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this domain" });
    }

    res.json(projects);
  } catch (err) {
    console.log("Error fetching projects by domain:", err);
    res.status(500).json({ error: "Failed to fetch projects by domain" });
  }
};

export const getProjectsByPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10, query = "" } = req.query;
    const skip = (page - 1) * limit;
    const limitNum = Number(limit);

    let projects = [];
    let totalProjects = 0;

    if (query.trim()) {
      // 🔍 Perform text search using Atlas Search
      const searchResults = await ProjectModel.aggregate([
        {
          $search: {
            index: "project_index",
            text: {
              query,
              path: { wildcard: "*" },
            },
          },
        },
        { $skip: skip },
        { $limit: limitNum },
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
          $project: {
            title: 1,
            domain: 1,
            abstract: 1,
            description: 1,
            image: 1,
            createdAt: 1,
            tags: 1,
            postedBy: { name: 1, picture: 1 },
          },
        },
      ]);

      const countResults = await ProjectModel.aggregate([
        {
          $search: {
            index: "project_index",
            text: {
              query,
              path: { wildcard: "*" },
            },
          },
        },
        { $count: "total" },
      ]);

      projects = searchResults;
      totalProjects = countResults[0]?.total || 0;
    } else {
      // 🗂️ Normal pagination without search
      projects = await ProjectModel.find()
        .populate("postedBy", "name role picture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum).lean()

      totalProjects = await ProjectModel.countDocuments();
    }

    const projectIds = projects.map((p) => p._id);

    // 🧮 Aggregate like & comment counts
    const [likeCounts, commentCounts] = await Promise.all([
      LikeModel.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $group: { _id: "$project", count: { $sum: 1 } } },
      ]),
      CommentModel.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $group: { _id: "$project", count: { $sum: 1 } } },
      ]),
    ]);

    const likesMap = Object.fromEntries(likeCounts.map((l) => [l._id.toString(), l.count]));
    const commentsMap = Object.fromEntries(commentCounts.map((c) => [c._id.toString(), c.count]));

    const enrichedProjects = projects.map((project) => {
      const id = project._id?.toString();
      return {
        ...project,
        likeCount: likesMap[id] || 0,
        commentCount: commentsMap[id] || 0,
      };
    });

    const totalPages = Math.ceil(totalProjects / limit);

    res.status(200).json({
      projects: enrichedProjects,
      totalProjects,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error in getProjects:", error);
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};


export const topProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.aggregate([
      // Join with Likes
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "project",
          as: "likes"
        }
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" }
        }
      },

      // Optional: Join with Comments if you also want commentCount
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "project",
          as: "comments"
        }
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" }
        }
      },

      { $sort: { likeCount: -1, createdAt: -1 } },
      { $limit: 3 },

      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy"
        }
      },
      { $unwind: "$postedBy" },

      {
        $project: {
          title: 1,
          description: 1,
          domain: 1,
          tags: 1,
          githublink: 1,
          liveLink: 1,
          image: 1,
          likeCount: 1,
          commentCount: 1,
          createdAt: 1,
          postedBy: {
            _id: 1,
            name: 1,
            role: 1,
            picture: 1
          }
        }
      }
    ]);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.json(projects);
  } catch (err) {
    console.error("Error fetching top projects:", err);
    res.status(500).json({ error: "Failed to fetch top projects" });
  }
};

