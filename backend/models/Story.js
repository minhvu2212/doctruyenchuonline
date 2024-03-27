const mongoose = require('mongoose');
const User = require('./User'); // Đường dẫn đến file mô hình User

// Định nghĩa schema cho danh mục (category)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const Category = mongoose.model('Category', categorySchema, 'Category');

// Định nghĩa schema cho chapter
const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // Thêm các trường thông tin khác của chapter nếu cần
});

const Chapter = mongoose.model('Chapter', chapterSchema, 'Chapter');

// Định nghĩa schema cho câu chuyện (story)
const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Tham chiếu đến schema của category
  creationDate: { type: Date, default: Date.now },
  status: { type: String, default: "draft" },
  thumbnail: { type: String },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }], // Tham chiếu đến schema của chapter
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến mô hình User
  author: { type: String, required: true } // Giữ nguyên kiểu dữ liệu String cho trường author
});

const Story = mongoose.model('Story', storySchema, 'Story');

module.exports = { Category, Chapter, Story };
