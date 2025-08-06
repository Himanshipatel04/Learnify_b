import mongoose from "mongoose";

const IdeaSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        tags: {
            type: [String],
        },
        description: {
            type: String,
            required: true,
        },
        requirements: {
            type: String,
            required: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
         likeCount: {
            type: Number,
            default: 0,
        },
        commentCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const IdeaModel = mongoose.model("Idea", IdeaSchema)
export default IdeaModel;                   
