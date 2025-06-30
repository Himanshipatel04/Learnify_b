import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

LikeSchema.index({ project: 1, likedBy: 1 }, { unique: true });

const LikeModel = mongoose.model("Like", LikeSchema);
export default LikeModel;
