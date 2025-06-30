// src/controllers/project.controller.js
import ProjectModel from "../models/project.model.js";
import LikeModel from "../models/like.model.js";
import CommentModel from "../models/comment.model.js";

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


export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate("postedBy", "name email picture") // show user details
      .sort({ createdAt: -1 });

    const likes = await LikeModel.find({ project: { $in: projects.map(p => p._id) } }).populate("user", "name _id");

    projects.forEach(project => {
      project.likes = likes.filter(like => like.project.toString() === project._id.toString());
    }
    );
    if (projects.length === 0) {
      return res.status(200).json({ message: "No projects found!" });
    }
    console.log("Fetched projects:", projects.length);

    res.json(projects);
  } catch (err) {
    console.log("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectDoc = await ProjectModel.findById(req.params.id)
      .populate("postedBy", "name picture role");

    if (!projectDoc) return res.status(404).json({ error: "Project not found" });

    const project = projectDoc.toObject();

    const likes = await LikeModel.find({ project: project._id }).select("likedBy").populate("likedBy", "name _id picture");
    const comments = await CommentModel.find({ project: project._id }).select("commentedBy content createdAt").populate("commentedBy", "name _id picture");

    project.likes = likes;
    project.likeCount = likes.length;
    project.comments = comments;

    project.hasLiked =
      req.user && req.user._id
        ? likes.some(like => like.likedBy._id.toString() === req.user._id.toString())
        : false;

    res.json(project);
  } catch (err) {
    console.log("Error fetching project:", err);
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
          tags: 1,
          postedBy: { name: 1 }
        }
      }
    ]);

    res.status(200).json(projects);
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
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const projects = await ProjectModel.find()
      .populate("postedBy", "name role picture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const projectIds = projects.map((p) => p._id);

    const [likeCounts, commentCounts] = await Promise.all([
      LikeModel.aggregate([
        { $match: { project: { $in: projectIds } } }, // ✅ Fix here
        { $group: { _id: "$project", count: { $sum: 1 } } },
      ]),
      CommentModel.aggregate([
        { $match: { project: { $in: projectIds } } }, // ✅ Fix here
        { $group: { _id: "$project", count: { $sum: 1 } } },
      ]),
    ]);

    const likesMap = Object.fromEntries(likeCounts.map((l) => [l._id.toString(), l.count]));
    const commentsMap = Object.fromEntries(commentCounts.map((c) => [c._id.toString(), c.count]));

    const enrichedProjects = projects.map((project) => {
      const id = project._id.toString();
      return {
        ...project.toObject(),
        likeCount: likesMap[id] || 0,
        commentCount: commentsMap[id] || 0,
      };
    });

    const totalProjects = await ProjectModel.countDocuments();
    const totalPages = Math.ceil(totalProjects / limit);

    res.json({
      projects: enrichedProjects,
      totalProjects,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching projects by pagination:", error);
    res.status(500).json({ error: "Failed to fetch projects by pagination" });
  }
};


