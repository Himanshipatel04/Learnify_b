import HackathonModel from "../models/hackathon.model.js";

// Create Hackathon
export const createHackathon = async (req, res) => {
  try {
    const imageUrl = req.file?.path || "";

    await HackathonModel.create({
      ...req.body,
      image: imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Hackathons
export const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await HackathonModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: hackathons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Hackathon by ID
export const getHackathonById = async (req, res) => {
  try {
    const hackathon = await HackathonModel.findById(req.params.id);
    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, message: "Hackathon not found" });
    }
    res.status(200).json({ success: true, data: hackathon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Hackathon
export const updateHackathon = async (req, res) => {
  try {
    const hackathon = await HackathonModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, message: "Hackathon not found" });
    }
    res.status(200).json({ success: true, data: hackathon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Hackathon
export const deleteHackathon = async (req, res) => {
  try {
    const hackathon = await HackathonModel.findByIdAndDelete(req.params.id);
    if (!hackathon) {
      return res
        .status(404)
        .json({ success: false, message: "Hackathon not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Hackathon deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Hackathons by User
export const getHackathonsByUser = async (req, res) => {
  try {
    const hackathons = await HackathonModel.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, data: hackathons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Hackathons by Pagination
export const getHackathonsByPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const hackathons = await HackathonModel.find()
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));
    const total = await HackathonModel.countDocuments();
    res.status(200).json({
      success: true,
      hackathons: hackathons,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Top Hackathons (Example: latest approved ones)
export const getTopHackathons = async (req, res) => {
  try {
    const hackathons = await HackathonModel.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({ success: true, data: hackathons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
