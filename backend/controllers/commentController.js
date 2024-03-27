const Comment = require('../models/Comment');
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;
    const storyId = req.params.storyId;

    const newComment = new Comment({
      content,
      author: userId,
      story: storyId
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCommentsForStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const comments = await Comment.find({ story: storyId }).populate('author', 'username');
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
  
      await Comment.findByIdAndDelete(commentId);
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  