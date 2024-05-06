const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true }, // Thêm trường storyId
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema, "Comment");
