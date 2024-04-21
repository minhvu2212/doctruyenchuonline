const Story = require('../models/Story');

const findStoryMiddleware = async (req, res, next) => {
    try {
        // Lấy storyId từ params của route
        const storyId = req.params.storyId;
        if (!storyId) {
            return res.status(400).json({ message: 'No story ID provided' });
        }

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        req.story = story;
        next();
    } catch (error) {
        console.error(error); // Thêm logging lỗi ở đây
        return res.status(500).json({ message: 'Error finding story', error: error.message });
    }
};

module.exports = findStoryMiddleware;
