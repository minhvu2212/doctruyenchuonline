const Comment = require('../models/Comment');
const createComment = async(req, res) => {
  const chapter = req.chapter;
  try {
      const newComment = new commentModels({
          chapter: chapter._id,
          author: req.verifiedUser._id,
          content: req.body.content,
      });

      const savedComment = await newComment.save();
      return res.status(201).json(savedComment);
  } catch (err) {
      return res.status(500).json(err);
  }
};

exports.getCommentsForStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const comments = await Comment.find({ chapter: storyId }).populate('author', 'username');
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

  module.exports.createComment = createComment;