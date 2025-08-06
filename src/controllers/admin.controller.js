import BlogModel from "../models/blog.model.js";
import CommentModel from "../models/comment.model.js";
import IdeaModel from "../models/idea.model.js";
import LikeModel from "../models/like.model.js";
import ProjectModel from "../models/project.model.js";
import UserModel from "../models/user.model.js";
import HackathonModel from "../models/hackathon.model.js";
import { sendMail } from "../utils/sendMail.js"

// Approve mentor
export const approveMentor = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === 'mentor') return res.status(400).json({ message: "User is already a mentor" });
        if (user.mentorDetails?.mentorRequestStatus !== 'pending') return res.status(400).json({ message: "Mentor request is not pending" });

        user.role = 'mentor';
        user.mentorDetails.mentorRequestStatus = 'approved';
        await user.save();

        await sendMail(user.email, 'approveMentor', { name: user.name });
        res.status(200).json({ message: "Mentor approved successfully", user });
    } catch (error) {
        console.log("Error approving mentor:", error);
        res.status(500).json({ message: "Error approving mentor request" });
    }
};

// Reject mentor
export const rejectMentor = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === 'mentor') return res.status(400).json({ message: "User is already a mentor" });
        if (user.mentorDetails?.mentorRequestStatus !== 'pending') return res.status(400).json({ message: "Mentor request is not pending" });

        user.mentorDetails.mentorRequestStatus = 'rejected';
        await user.save();

        await sendMail(user.email, 'rejectMentor', { name: user.name });
        res.status(200).json({ message: "Mentor rejected successfully", user });
    } catch (error) {
        console.log("Error rejecting mentor", error);
        res.status(500).json({ message: "Error rejecting mentor request" });
    }
};

const paginate = async (model, req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await model.countDocuments();

    let dataQuery = model.find();

    if (model.modelName === "User") {
      dataQuery = dataQuery.select("-password -__v");
    } else {
      dataQuery = dataQuery.populate("postedBy", "name email");
    }

    const data = await dataQuery
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
  }
};


// Dashboard figures
export const getFigures = async (req, res) => {
    try {
        const figures = {
            users: await UserModel.countDocuments(),
            projects: await ProjectModel.countDocuments(),
            ideas: await IdeaModel.countDocuments(),
            blogs: await BlogModel.countDocuments(),
            hackathons: await HackathonModel.countDocuments(),
            comments: await CommentModel.countDocuments(),
            likes: await LikeModel.countDocuments(),
        };
        res.json(figures);
    } catch (err) {
        res.status(500).json({ message: "Error loading dashboard", error: err.message });
    }
};

// Paginated Getters
export const getUsers = (req, res) => paginate(UserModel, req, res);
export const getProjects = (req, res) => paginate(ProjectModel, req, res);
export const getIdeas = (req, res) => paginate(IdeaModel, req, res);
export const getBlogs = (req, res) => paginate(BlogModel, req, res);
// Assuming mentor = UserModel with role='mentor', you can filter below


export const getMentors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const total = await UserModel.countDocuments({ role: 'mentor' });
        const data = await UserModel.find({ role: 'mentor' })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({ total, page, totalPages: Math.ceil(total / limit), data });
    } catch (err) {
        res.status(500).json({ message: "Error fetching mentors", error: err.message });
    }
};
export const getHackathons = (req, res) => paginate(HackathonModel, req, res);

// Delete Handlers
export const deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        await ProjectModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

export const deleteIdea = async (req, res) => {
    try {
        await IdeaModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Idea deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        await BlogModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

// Optional: if mentors are stored separately
export const deleteMentor = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Mentor deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

export const deleteHackathon = async (req, res) => {
    try {
        await HackathonModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Hackathon deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};

// Approve/Reject Hackathon
export const approveHackathon = async (req, res) => {
    try {
        const hackathon = await HackathonModel.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        res.json({ message: "Hackathon approved", hackathon });
    } catch (err) {
        res.status(500).json({ message: "Approval failed", error: err.message });
    }
};

export const rejectHackathon = async (req, res) => {
    try {
        const hackathon = await HackathonModel.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.json({ message: "Hackathon rejected", hackathon });
    } catch (err) {
        res.status(500).json({ message: "Rejection failed", error: err.message });
    }
};

// Send mail
export const sendMailByAdmin = async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await sendMail({ to, subject, text });
        res.json({ message: "Mail sent" });
    } catch (err) {
        res.status(500).json({ message: "Mail failed", error: err.message });
    }
};
