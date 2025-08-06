import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    registrationLink: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    prizes: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      default: "Open to all",
    },
    contactEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const HackathonModel = mongoose.model("Hackathon", hackathonSchema);

export default HackathonModel;
