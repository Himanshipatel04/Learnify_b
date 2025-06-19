import mongoose from "mongoose";

const ProjectSchema = mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        tags:{
            type: [String], 
        },
        domain: {
            type: String,
            required: true,
        },
        abstract: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videolink: {
            type: String,
        },
        githublink: {
            type: String,
        },
        collegename: {
            type: String,
            required: true,
        },
        liveLink:{
            type: String,           
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const ProjectModel = mongoose.model("Project", ProjectSchema)
export default ProjectModel;                                