import UserModel from "../models/user.model";

export const applyForMentorship = async () => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        if (user.role === 'mentor') {
            return res.status(403).json({ error: "User is already a mentor" })
        }
        user.mentorDetails.mentorRequestStatus = 'pending';
        user.save()
        return res.status(200).json({ message: "Mentorship request applied successfully! If your request status will be notified via email.", user });
    } catch (error) {
        console.log("Error applying for mentorship:", error);
        return res.status(500).json({ error: "Error applying for mentorship request" });
    }
}