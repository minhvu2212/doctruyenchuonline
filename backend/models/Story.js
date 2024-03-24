const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approved: { type: Boolean, default: false }, // Added approved field
  // Add other story fields as needed
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
