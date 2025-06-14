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

