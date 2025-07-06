import IdeaModel from "../models/idea.model";


export const createIdea = async (req, res) => {
  try {
    const newIdea = new IdeaModel({
      ...req.body,
      postedBy: req.user._id, // assuming user is authenticated and req.user exists
    });
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create idea', error });
  }
};

export const getIdeasByUser = async (req, res) => {
  try {
    const ideas = await IdeaModel.find({ postedBy: req.user._id }).populate('postedBy', 'name');
    if (!ideas || ideas.length === 0) {
      return res.status(200).json({ message: 'No ideas found!' });
    }
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user ideas', error });
  }
}

// Get All Ideas
export const getAllIdeas = async (req, res) => {
  try {
    const ideas = await IdeaModel.find().populate('postedBy', 'name');
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get ideas', error });
  }
};

// Get Idea by ID
export const getIdeaById = async (req, res) => {
  try {
    const idea = await IdeaModel.findById(req.params.id).populate('postedBy', 'name');
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get idea', error });
  }
};

// Update Idea
export const updateIdea = async (req, res) => {
  try {
    const idea = await IdeaModel.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Optional: check if the logged-in user is the owner (postedBy)
    if (idea.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this idea' });
    }

    Object.assign(idea, req.body);
    const updatedIdea = await idea.save();
    res.status(200).json(updatedIdea);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update idea', error });
  }
};

// Delete Idea
export const deleteIdea = async (req, res) => {
  try {
    const idea = await IdeaModel.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Optional: check if the logged-in user is the owner (postedBy)
    if (idea.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this idea' });
    }

    await idea.deleteOne();
    res.status(200).json({ message: 'Idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete idea', error });
  }
};

export const searchIdeas = async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ message: 'Search query is required' });

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive

    // Find ideas where title, description, or tags match
    let ideas = await IdeaModel.find({
      $or: [
        { title: regex },
        { description: regex },
        { tags: { $in: [regex] } },
      ],
    }).populate('postedBy', 'name'); // populate postedBy with only 'name' field

    // Filter ideas by poster name match (if query matches poster name)
    ideas = ideas.filter(idea => idea.postedBy?.name.match(regex));

    // If no matches by poster name, return the original filtered ideas
    if (ideas.length === 0) {
      ideas = await IdeaModel.find({
        $or: [
          { title: regex },
          { description: regex },
          { tags: { $in: [regex] } },
        ],
      }).populate('postedBy', 'name');
    }

    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};

export const getIdeasByPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10, query = "" } = req.query;
    const skip = (page - 1) * limit;

    const searchCondition = query.trim()
      ? {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }
      : {};

    const ideas = await IdeaModel.find(searchCondition)
      .populate("postedBy", "name picture role")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const totalIdeas = await IdeaModel.countDocuments(searchCondition);
    const totalPages = Math.ceil(totalIdeas / limit);

    res.json({
      ideas,
      totalIdeas,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
};

export const getTopIdeas = async (req, res) => {
  try {
    const topIdeas = await IdeaModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("postedBy", "name picture role");

    res.json(topIdeas);
  } catch (error) {
    console.error("Error fetching top ideas:", error);
    res.status(500).json({ error: "Failed to fetch top ideas" });
  }
};

