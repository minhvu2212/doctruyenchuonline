const { Story } = require('../models/Story');

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
    const { title, content, category, creationDate, status, thumbnail, author } = req.body;
    let username = null;
    if (req.user && req.user.username) {
      username = req.user.username;
    } else {
      // Xử lý trường hợp khi không có thông tin người dùng từ token
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const newStory = new Story({
      title,
      content,
      category,
      creationDate,
      status,
      thumbnail,
      owner: username, // Gán owner là tên người dùng hiện tại
      author, // Sử dụng giá trị của author từ request body
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
