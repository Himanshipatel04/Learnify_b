import BlogModel from "../models/blog.model";
import ProjectModel from "../models/project.model";
import UserModel from "../models/user.model";
import IdeaModel from "../models/idea.model";
import { NotificationModel } from "../models/notification.model";

export const applyForMentorship = async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            designation,
            company,
            experience,
            skills,
            linkedin,
            reason,
        } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role === 'mentor') {
            return res.status(403).json({ error: "User is already a mentor" });
        }

        user.mentorDetails = {
            designation,
            company,
            experience,
            skills,
            linkedin,
            reason,
            mentorRequestStatus: 'pending',
        };

        await user.save();

        const notification = new NotificationModel({
            user: user._id,
            message: `You have applied for mentorship. Please wait for approval.`,
            read: false,
        });
        await notification.save();

        return res.status(200).json({
            message:
                "Mentorship request applied successfully! You will be notified via email.",
            user,
        });
    } catch (error) {
        console.log("Error applying for mentorship:", error);
        return res.status(500).json({ error: "Error applying for mentorship request" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { github, linkedinUrl, bio, college } = req.body;

        // console.log(github, linkedinUrl, bio, college);   

        if (bio && bio.length > 20) {
            return res.status(400).json({ error: "Bio must be less than 20 characters" });
        }

        const updates = {};

        if (github !== undefined) updates.githubUsername = github;
        if (linkedinUrl !== undefined) updates.linkedinUrl = linkedinUrl;
        if (bio !== undefined) updates.bio = bio;
        if (college !== undefined) updates.college = college;

        const user = await UserModel.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        console.log("hello")
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserProfileData = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userBlogs = await BlogModel.find({ postedBy: userId }).sort({ createdAt: -1 })

        const userProjects = await ProjectModel.find({ postedBy: userId }).sort({ createdAt: -1 })

        const userIdeas = await IdeaModel.find({ postedBy: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            user,
            blogs: userBlogs,
            projects: userProjects,
            ideas: userIdeas,
        });
    } catch (error) {
        console.error("Error fetching user profile data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const togglePrivacy = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.isProfilePrivate = !user.isProfilePrivate;
        await user.save();
        console.log("User privacy setting updated:", user.isProfilePrivate);
        return res.status(200).json({ message: "Privacy setting updated", isProfilePrivate: user.isProfilePrivate });
    } catch (error) {
        console.error("Error toggling privacy:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export const getMentorsByPagination = async (req, res) => {
    try {
        const { page = 1, limit = 10, query = "" } = req.query;
        const skip = (page - 1) * limit;

        // Searching on name, company, skills (inside mentorDetails)
        const searchCondition = query.trim()
            ? {
                role: "mentor",
                "mentorDetails.mentorRequestStatus": "approved",
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { "mentorDetails.skills": { $regex: query, $options: "i" } },
                    { "mentorDetails.company": { $regex: query, $options: "i" } },
                ],
            }
            : {
                role: "mentor",
                "mentorDetails.mentorRequestStatus": "approved",
            };

        console.log(searchCondition)

        const mentors = await UserModel.find(searchCondition)
            .skip(Number(skip))
            .limit(Number(limit))
            .select("-password")
            .sort({ createdAt: -1 });

        console.log(mentors)

        const totalMentors = await UserModel.countDocuments(searchCondition);
        const totalPages = Math.ceil(totalMentors / limit);

        res.json({
            mentors,
            totalMentors,
            totalPages,
            currentPage: Number(page),
        });
    } catch (error) {
        console.error("Error fetching mentors by pagination:", error);
        res.status(500).json({ error: "Failed to fetch mentors by pagination" });
    }
};

export const getTopMentors = async (req, res) => {
    try {
        const mentors = await UserModel.find({
            role: "mentor",
            "mentorDetails.mentorRequestStatus": "approved",
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name picture mentorDetails.skills mentorDetails.company");

        res.json(mentors);
    } catch (error) {
        console.error("Error fetching top mentors:", error);
        res.status(500).json({ error: "Failed to fetch top mentors" });
    }
};
