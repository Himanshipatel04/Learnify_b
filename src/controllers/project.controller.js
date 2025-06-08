import ProjectModel from "../models/project.model";

export const createProject = async (req, res) => {
  try {
    const project = await ProjectModel.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.log("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project", details: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate("postedBy", "name email role") // show user details
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.log("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id)
      .populate("postedBy", "name email role");

    if (!project) return res.status(404).json({ error: "Project not found" });

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

  if (!query) return res.status(400).json({ message: 'Search query is required' });

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive regex

    // First, find projects matching title, domain or tags
    let projects = await ProjectModel.find({
      $or: [
        { title: regex },
        { domain: regex },
        { tags: { $in: [regex] } },
      ],
    }).populate('postedBy', 'name'); // populate only name of postedBy

    // Filter projects by postedBy.name matching regex
    const filteredByPosterName = projects.filter(project =>
      project.postedBy?.name?.match(regex)
    );

    // Combine projects matched by fields and those matched by poster name (avoid duplicates)
    const combined = [...new Map(
      [...projects, ...filteredByPosterName].map(item => [item._id.toString(), item])
    ).values()];

    res.status(200).json(combined);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};

export const getProjectsByUser = async (req, res) => {
  try {
    const projects = await ProjectModel.find({ postedBy: req.user._id })
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user" });
    }

    res.json(projects);
  } catch (err) {
    console.log("Error fetching user projects:", err);
    res.status(500).json({ error: "Failed to fetch user projects" });
  }
}                                         