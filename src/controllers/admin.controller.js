import IdeaModel from "../models/idea.model";
import ProjectModel from "../models/project.model";
import UserModel from "../models/user.model"
import { sendMail } from "../utils/sendMail";

export const getFigures = async (req, res) => {
    try {
        const totalUsers = UserModel.countDocuments({});
        const students = UserModel.countDocuments({ role: 'user' });
        const mentors = UserModel.countDocuments({ role: 'mentor' });
        const projects = ProjectModel.countDocuments({});
        const ideas = IdeaModel.countDocuments({});
        res.status(200).json({
            totalUsers: await totalUsers,
            students: await students,
            mentors: await mentors,
            projects: await projects,
            ideas: await ideas
        });
    } catch (error) {
        console.error("Error fetching figures:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const approveMentor = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === 'mentor') {
            return res.status(400).json({ message: "User is already a mentor" });
        }
        if (user.mentorDetails.mentorRequestStatus !== 'pending') {
            return res.status(400).json({ message: "Mentor request is not pending" });
        }
        user.role = 'mentor';
        user.mentorDetails.mentorRequestStatus = 'approved';
        await user.save();
        await sendMail(user.email, 'approveMentor', {
            name: user.name,
        });
        return res.status(200).json({ message: "Mentor approved successfully", user });
    } catch (error) {
        console.log("Error approving mentor:", error);
        return res.status(500).json({ message: "Error approving mentor request" });
    }
}

export const rejectMentor = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === 'mentor') {
            return res.status(400).json({ message: "User is already a mentor" });
        }
        if (user.mentorDetails.mentorRequestStatus !== 'pending') {
            return res.status(400).json({ message: "Mentor request is not pending" });
        }
        user.mentorDetails.mentorRequestStatus = 'rejected';
        await user.save();
         await sendMail(user.email, 'rejectMentor', {
            name: user.name,
        });
        return res.status(200).json({ message: "Mentor rejected successfully", user });
    }

    
    catch (error) {
        console.log("Error rejecting mentor", error)
        return res.status(500).json({ message: "Error rejecting mentor request" });
    }
}



