import CommentModel from "../models/comment.model.js";

// POST /api/projects/:id/comments
export const addComment = async (req, res) => {
  try {
    const { newComment } = req.body;
    const { projectId } = req.params;

    const comment = await CommentModel.create({
      content: newComment,
      project: projectId,
      commentedBy: req.user._id,
    });

    const populatedComment = await comment.populate("commentedBy", "name picture");

    res.status(201).json(populatedComment);
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