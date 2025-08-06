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
        return res.json({ message: "Liked" });

    } catch (err) {
        return res.status(500).json({ error: "Like operation failed" });
    }
};

export const toggleLikeBlog = async (req, res) => {

    const userId = req.user._id;
    const blogId = req.params.id;
    try {
        const existingLike = await LikeModel.findOne({ blog: blogId, likedBy: userId });
        if (existingLike) {
            await LikeModel.deleteOne({ _id: existingLike._id });
            return res.json({ message: "Unliked" });
        }
        await LikeModel.create({ blog: blogId, likedBy: userId });
        return res.json({ message: "Liked" });

    }
    catch (err) {
        return res.status(500).json({ error: "Like operation failed" });
    }
}

export const toggleLikeIdea = async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.params.id;

    try {
        const existingLike = await LikeModel.findOne({ idea: ideaId, likedBy: userId });
        if (existingLike) {
            await LikeModel.deleteOne({ _id: existingLike._id });
            return res.json({ message: "Unliked" });
        }
        await LikeModel.create({ idea: ideaId, likedBy: userId });
        return res.json({ message: "Liked" });

    } catch (err) {
        return res.status(500).json({ error: "Like operation failed" });
    }
}

