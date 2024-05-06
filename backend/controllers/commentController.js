const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    // Kiểm tra xem có tồn tại storyId và chapterId trong param không
    const storyId = req.params.storyId;
    const chapterId = req.params.chapterId;
    if (!storyId || !chapterId) {
      return res.status(400).json({ message: 'Story ID or Chapter ID not found in request params' });
    }

    // Kiểm tra xem người dùng đã được xác thực chưa
    if (!req.verifiedUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Kiểm tra xem nội dung bình luận có tồn tại không
    if (!req.body.content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Tạo một bình luận mới
    const newComment = new Comment({
      storyId,
      chapter: chapterId,
      author: req.verifiedUser._id,
      content: req.body.content,
    });

    // Lưu bình luận vào cơ sở dữ liệu
    const savedComment = await newComment.save();

    // Trả về kết quả thành công
    return res.status(201).json(savedComment);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Error creating comment:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


const getCommentsForStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    console.log("Story ID:", storyId); // Kiểm tra giá trị của storyId
    const comments = await Comment.find({ storyId }).populate('author', 'username');
    console.log("Comments:", comments); // Kiểm tra kết quả trả về từ cơ sở dữ liệu
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createComment,
  getCommentsForStory,
  deleteComment
};
