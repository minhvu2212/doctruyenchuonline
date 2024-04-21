const Story = require("../models/Story");

const createStory = async(req, res) => {
    const newStory = new Story({
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover,
        categories: req.body.categories,
        tags: req.body.tags,
        author: req.verifiedUser._id,
    });
    try {
        const savedStory = await newStory.save();
        return res.status(201).json(savedStory);
    } catch (err) {
        return res.status(500).json(err);
    }
};


const getStories = async(req, res) => {
    try {
        const stories = await Story.find();
        return res.status(200).json(stories);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getStory = async (req, res) => {
    try {
        console.log("Fetching story...");

        // Ghi lại ID của câu chuyện được yêu cầu
        console.log("Requested story ID:", req.story._id);

        // Thực hiện aggregate để lấy thông tin câu chuyện
        const story = await Story.aggregate([
            { $match: { _id: req.story._id } },
            {
                $lookup: {
                    from: "Chapter",
                    let: {
                        storyId: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$$storyId", "$story"] },
                            },
                        },
                        {
                            $lookup: {
                                from: "Vote",
                                localField: "_id",
                                foreignField: "chapter",
                                as: "votes",
                            },
                        },
                        {
                            $lookup: {
                                from: "Read",
                                localField: "_id",
                                foreignField: "chapter",
                                as: "reads",
                            },
                        },
                        {
                            $lookup: {
                                from: "Comment",
                                localField: "_id",
                                foreignField: "chapter",
                                as: "comments",
                            },
                        },
                        {
                            $addFields: {
                                reads: { $size: "$reads" },
                                votes: { $size: "$votes" },
                                comments: { $size: "$comments" },
                            },
                        },
                    ],
                    as: "chapters",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author",
            },
            {
                $project: {
                    author: {
                        password: 0,
                        __v: 0,
                        _id: 0,
                    },
                },
            },
            {
                $lookup: {
                    from: "Tag",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags",
                },
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {
                $addFields: {
                    reads: {
                        $sum: "$chapters.reads",
                    },
                    votes: {
                        $sum: "$chapters.votes",
                    },
                    comments: {
                        $sum: "$chapters.comments",
                    },
                    readTime: {
                        $sum: "$chapters.readTime",
                    },
                    chapters: {
                        $size: "$chapters",
                    },
                },
            },
        ]);

        // Log thông tin câu chuyện được trả về
        console.log("Fetched story:", story);

        // Trả về thông tin câu chuyện
        return res.status(200).json(story[0]);
    } catch (err) {
        // Log lỗi nếu có
        console.error('Error fetching story:', err.message);
        return res.status(500).json(err);
    }
};


const deleteStory = async(req, res) => {
    const story = req.story;
    try {
        const deletedStory = await Story.findByIdAndDelete(story._id);
        return res.status(200).json(deletedStory);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateStory = async(req, res) => {
    const story = req.story;
    try {
        const updatedStory = await Story.findByIdAndUpdate(
            story._id,
            req.body, {
                new: true,
            }
        );
        return res.status(200).json(updatedStory);
    } catch (err) {
        return res.status(500).json(err);
    }
};
const userStories = async (req, res) => {
    try {
        const userId = req.verifiedUser._id; // Sử dụng _id từ token đã được xác thực
        console.log("UserID:", userId); // Log userId để kiểm tra xem nó có chính xác không
  
        // Tìm tất cả các truyện mà người dùng đã đăng dựa trên userId
        const stories = await Story.find({ author: userId });
        console.log("Found Stories:", stories); // Log các truyện được tìm thấy để kiểm tra
  
        // Kiểm tra xem có truyện nào được tìm thấy không
        if (stories.length === 0) {
            // Nếu không tìm thấy truyện nào, trả về thông báo phù hợp
            console.log("No stories found for this user");
            return res.status(404).json({ message: 'No stories found for this user' });
        }
  
        // Trả về danh sách các truyện mà người dùng đã đăng
        return res.status(200).json(stories);
    } catch (err) {
        // Trả về lỗi nếu có vấn đề xảy ra trong quá trình tìm kiếm
        console.error('Error fetching user stories:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports.userStories = userStories;

module.exports.getStory = getStory;
module.exports.getStories = getStories;
module.exports.createStory = createStory;
module.exports.deleteStory = deleteStory;
module.exports.updateStory = updateStory;