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
  volumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volume' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approved: { type: Boolean, default: false },
  // Add other story fields as needed
});

const Chapter = mongoose.model('Chapter', chapterSchema);
const Volume = mongoose.model('Volume', volumeSchema);
const Story = mongoose.model('Story', storySchema);

module.exports = { Chapter, Volume, Story };
