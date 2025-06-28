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



