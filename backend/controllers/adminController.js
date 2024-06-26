const User = require('../models/User');
const Story = require('../models/Story');
exports.checkAdmin = (req, res, next) => {
  if (req.verifiedUser.isAdmin === true) {
      res.status(200).json({ isAdmin: true });
  } else {
      res.status(200).json({ isAdmin: false });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    // Kiểm tra xem req.user đã được xác định chưa
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }

    // Tạo một tài khoản admin mới
    const { username, password } = req.body;

    // Kiểm tra xem tài khoản đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({
      username,
      password,
      isAdmin: true // Gán quyền admin cho tài khoản mới
    });

    await newUser.save();
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.approveStory = async (req, res) => {
  try {
    // Kiểm tra xem người dùng đã đăng nhập có phải là quản trị viên không
    if (!req.verifiedUser || req.verifiedUser.isAdmin !== true) {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    

    // Kiểm tra xem có ID của câu chuyện cần duyệt trong params hay không
    const { id } = req.params;
    const storyIds = req.body.storyIds || [id]; // Nếu không có storyIds trong body, sử dụng id từ params

    // Kiểm tra xem storyIds có tồn tại và có phải là một mảng không
    if (!Array.isArray(storyIds) || storyIds.length === 0) {
      return res.status(400).json({ message: 'Invalid story IDs' });
    }

    // Duyệt qua từng ID và cập nhật trạng thái của câu chuyện tương ứng thành đã phê duyệt
    for (const storyId of storyIds) {
      // Kiểm tra xem ID của câu chuyện hợp lệ hay không
      if (!storyId) {
        return res.status(400).json({ message: 'Invalid story ID' });
      }

      // Cập nhật trạng thái của câu chuyện thành đã phê duyệt
      await Story.findByIdAndUpdate(storyId, { approved: true });
    }

    // Trả về thông báo thành công
    res.status(200).json({ message: 'Stories approved successfully' });
  } catch (error) {
    console.error('Error approving stories:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Hàm kiểm tra nội dung của truyện
exports.checkStoryContent = async (req, res) => {
  try {
    const { content } = req.body;

    // Kiểm tra nội dung của truyện
    const isContentInappropriate = checkForInappropriateKeywords(content);

    // Trả về kết quả kiểm tra
    res.status(200).json({ isContentInappropriate });
  } catch (error) {
    console.error('Error checking story content:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Hàm kiểm tra từ khóa của truyện
const checkForInappropriateKeywords = (content) => {
  const inappropriateKeywords = ['explicit', 'obscene', 'vulgar', 'offensive', 'inappropriate', 'profanity'];

  const lowerCaseContent = content.toLowerCase();

  for (const keyword of inappropriateKeywords) {
    if (lowerCaseContent.includes(keyword)) {
      return true;
    }
  }
  return false;
};


