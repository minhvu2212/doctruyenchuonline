const Story = require("../models/Story");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Thư mục lưu trữ tạm thời cho các file tải lên

const createStory = async (req, res) => {
    try {
        console.log("Creating new story...");
        
        // Kiểm tra xem có file cover được tải lên không
        if (!req.file) {
            console.log("No cover image uploaded");
            return res.status(400).json({ message: 'Cover image is required' });
        }

        // Lấy đường dẫn của file cover đã tải lên
        const coverPath = req.file.path;
        console.log("Cover image path:", coverPath);

        // Tạo một câu chuyện mới với các thông tin từ request body
        const newStory = new Story({
            title: req.body.title,
            description: req.body.description,
            cover: coverPath, // Đường dẫn đến file cover
            categories: req.body.categories,
            tags: req.body.tags,
            author: req.verifiedUser._id,
        });

        // Lưu câu chuyện vào cơ sở dữ liệu
        console.log("Saving new story...");
        const savedStory = await newStory.save();
        console.log("New story saved:", savedStory);

        return res.status(201).json(savedStory);
    } catch (err) {
        console.error("Error creating story:", err);

        // Xóa file cover đã tải lên nếu có lỗi xảy ra
        if (req.file) {
            console.log("Deleting uploaded cover image due to error...");
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json(err);
    }
};




const getStories = async (req, res) => {
    try {
        const { title } = req.query;
        let stories;
        if (title !== undefined && title !== null) {
            const encodedTitle = decodeURIComponent(title);
            stories = await Story.find({ title: { $regex: new RegExp(encodedTitle, 'i') } });
        } else {
            stories = await Story.find();
        }

        // Thêm đường dẫn của ảnh bìa vào mỗi câu chuyện
        const storiesWithCoverURL = stories.map(story => {
            return {
                ...story.toJSON(),
                cover: `${req.protocol}://${req.get('host')}/${story.cover}`
            };
        });

        return res.status(200).json(storiesWithCoverURL);
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
        const userId = req.verifiedUser._id;
        console.log("UserID:", userId);

        // Tìm tất cả các truyện mà người dùng đã đăng dựa trên userId
        const stories = await Story.find({ author: userId });
        console.log("Found Stories:", stories);

        // Kiểm tra xem có truyện nào được tìm thấy không
        if (stories.length === 0) {
            console.log("No stories found for this user");
            return res.status(404).json({ message: 'No stories found for this user' });
        }

        // Trả về danh sách các truyện mà người dùng đã đăng, bao gồm cả trường cover
        const storiesWithCover = stories.map(story => {
            return {
                ...story.toJSON(),
                cover: `${req.protocol}://${req.get('host')}/${story.cover}`
            };
        });

        // Trả về danh sách các truyện mà người dùng đã đăng, bao gồm cả trường cover
        return res.status(200).json(storiesWithCover);
    } catch (err) {
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