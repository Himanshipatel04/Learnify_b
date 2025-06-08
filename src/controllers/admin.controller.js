import ProjectModel from "../models/project.model";
import UserModel from "../models/user.model"


const getFigures = async (req, res) => {
    try {
        const totalUsers = UserModel.countDocuments({});
        const students = UserModel.countDocuments({ role: 'user' });
        const mentors = UserModel.countDocuments({ role: 'mentor' });
        const projects = ProjectModel.countDocuments({});

    } catch (error) {

    }
}