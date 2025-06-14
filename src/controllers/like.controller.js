import LikeModel from "../models/like.model";

export const toggleLikeProject = async (req, res) => {
    const userId = req.user._id;
    const projectId = req.params.id;

    try {
        const existingLike = await LikeModel.findOne({ project: projectId, likedBy: userId });

        if (existingLike) {
            await LikeModel.deleteOne({ _id: existingLike._id });
            return res.json({ message: "Unliked" });
        }

        await LikeModel.create({ project: projectId, likedBy: userId });
        res.json({ message: "Liked" });

    } catch (err) {
        res.status(500).json({ error: "Like operation failed" });
    }
};

export const getProjectLikeCount = async (req, res) => {
    const projectId = req.params.id;

    try {
        const count = await LikeModel.countDocuments({ project: projectId });
        res.json({ projectId, totalLikes: count });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch like count" });
    }
};

export const hasUserLikedProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user._id;

    try {
        const liked = await LikeModel.exists({ project: projectId, likedBy: userId });
        res.json({ liked: !!liked });
    } catch (err) {
        res.status(500).json({ error: "Failed to check like status" });
    }
};

