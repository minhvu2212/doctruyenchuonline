const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // Add other chapter fields as needed
});

const volumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  // Add other volume fields as needed
});

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String },
  creationDate: { type: Date, default: Date.now },
  status: { type: String, default: "draft" },
  thumbnail: { type: String },
  volumes: [{
    chapters: [{
      title: { type: String },
      content: { type: String }
    }]
  }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID của người sở hữu
  author: { type: String, required: true } // Tên tác giả
});


const Chapter = mongoose.model('Chapter', chapterSchema);
const Volume = mongoose.model('Volume', volumeSchema);
const Story = mongoose.model('Story', storySchema);

module.exports = { Chapter, Volume, Story };
