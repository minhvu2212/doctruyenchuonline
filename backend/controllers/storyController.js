const Story = require("../models/Story");

const createStory = async(req, res) => {
    const newStory = new Story({
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover,
        categories: req.body.categories,
        tags: req.body.tags,
        rating: req.body.rating,
        language: req.body.language,
        targetAudience: req.body.targetAudience,
        author: req.verifiedUser._id,
        approved: false, // Thêm trường approved mặc định là false
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

const getStory = async(req, res) => {
    try {
        const story = await Story.aggregate([
            { $match: { _id: req.story._id } },
            {
                $lookup: {
                    from: "Chapter",
                    let: {
                        storyId: "$_id",
                    },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: ["$$storyId", "$story"],
                                },
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
        return res.status(200).json(story[0]);
    } catch (err) {
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

module.exports.getStory = getStory;
module.exports.getStories = getStories;
module.exports.createStory = createStory;
module.exports.deleteStory = deleteStory;
module.exports.updateStory = updateStory;