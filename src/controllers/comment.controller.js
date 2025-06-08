import CommentModel from "../models/comment.model.js";

export const addComment = async (req, res) => {
    const userId = req.user._id;
    const { content } = req.body;
    const { projectId } = req.params;

    if (!content) return res.status(400).json({ error: "Comment content is required" });

    try {
        const comment = await CommentModel.create({
            project: projectId,
            commentedBy: userId,
            content,
        });

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: "Failed to add comment" });
    }
};
export const getCommentsByProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const comments = await CommentModel.find({ project: projectId })
            .populate("commentedBy", "name picture")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    try {
        const comment = await CommentModel.deleteOne({ _id: commentId, commentedBy: userId });
        if (comment.deletedCount === 0) {
            return res.status(404).json({ error: "Comment not found or you do not have permission to delete it" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.log("Error while deleting comment:", error);
    }
}