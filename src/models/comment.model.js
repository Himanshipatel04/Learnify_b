import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    idea:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",  
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },      
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;
