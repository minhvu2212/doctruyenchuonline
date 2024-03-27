const Story = require('../models/Story');

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find({ approved: true }).populate('author', 'username');
    res.status(200).json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId).populate('author', 'username');
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (error) {
    console.error('Error fetching story:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStory = async (req, res) => {
  try {
    const { title, content, category, creationDate, status, thumbnail, volumes } = req.body;
    const userId = req.user.userId; // User ID from JWT token
    const author = req.user.username; // Author name from JWT token

    // Kiểm tra volumes có được cung cấp không, nếu không thì mặc định là một tập truyện
    const newVolumes = volumes || [{ chapters: [] }];

    const newStory = new Story({
      title,
      content,
      category,
      creationDate,
      status,
      thumbnail,
      owner: userId,
      author,
      volumes: newVolumes
    });

    await newStory.save();
    res.status(201).json({ message: 'Story created successfully' });
  } catch (error) {
    console.error('Error creating story:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user.userId; // User ID from JWT token

    const story = await Story.findOne({ _id: storyId, owner: userId });
    if (!story) {
      return res.status(404).json({ message: 'Story not found or you do not have permission to delete this story' });
    }

    await Story.findByIdAndDelete(storyId);
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
