const chapterModel = require("../models/Chapter");
const Story = require("../models/Story");
const readModels = require("../models/Read");
const mongoose = require("mongoose");
const createChapter = async(req, res) => {
    const newChapter = new chapterModel({
        title: req.body.title,
        content: req.body.content,
        story: req.story._id,
        order: req.body.order,
    });
    try {
        const savedChapter = await newChapter.save();
        return res.status(201).json(savedChapter);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getStoryChapters = async(req, res) => {
    try {
        const chapters = await chapterModel.find({ story: req.story._id }).sort({ order: 1 }); // Sắp xếp theo trường order
        return res.status(200).json(chapters);
    } catch (err) {
        return res.status(500).json(err);
    }
};


const getChapter = async (req, res) => {
    const chapter = req.chapter;
    console.log('Request chapter:', chapter); // Log giá trị của chapter

    try {
        const readExist = await readModels.findOne({
            chapter: chapter._id,
            reader: req.verifiedUser._id,
        });
        console.log('readExist:', readExist); // Log để kiểm tra giá trị của readExist

        if (!readExist) {
            const newRead = new readModels({
                chapter: chapter._id,
                reader: req.verifiedUser._id,
            });
            await newRead.save();
            console.log('New read saved:', newRead); // Log sau khi lưu newRead
        }

        const chap = await chapterModel.aggregate([
            { $match: { _id: req.chapter._id } },
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
            ...(req.verifiedUser ? [
                {
                    $lookup: {
                        from: "Vote",
                        let: { chapterId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$$chapterId", "$chapter"] },
                                            { $eq: ["$voter", new mongoose.Types.ObjectId(req.verifiedUser._id)] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "voters",
                    },
                },
                {
                    $addFields: {
                        voters: { $size: "$voters" },
                    },
                },
                {
                    $addFields: {
                        reads: { $size: "$reads" },
                        votes: { $size: "$votes" },
                        comments: { $size: "$comments" },
                        canVote: {
                            $switch: {
                                branches: [
                                    { case: { $ne: ["$voters", 0] }, then: false },
                                    { case: { $eq: ["$voters", 0] }, then: true },
                                ],
                            },
                        },
                    },
                },
                { $unset: "voters" },
            ] : []),
        ]);
        console.log('Chapter aggregate result:', chap); // Log để kiểm tra giá trị của chap

        if (chap.length > 0) {
            return res.status(200).json(chap[0]);
        } else {
            console.warn('No chapter found in aggregation'); // Log cảnh báo nếu không tìm thấy chương nào
            return res.status(404).json({ message: 'Chapter not found' });
        }
    } catch (err) {
        console.error('Error in getChapter:', err); // Log để kiểm tra lỗi
        return res.status(500).json({ error: 'Internal server error' });
    }
};



const deleteChapter = async (req, res) => {
    const chapter = req.chapter;
    try {
        console.log("Deleting chapter:", chapter); // Log thông tin về chương trước khi xóa
        const deletedChapter = await chapterModel.findByIdAndDelete(chapter._id);
        console.log("Deleted chapter:", deletedChapter); // Log thông tin về chương sau khi xóa
        return res.status(200).json(deletedChapter);
    } catch (err) {
        console.error("Error deleting chapter:", err); // Log lỗi nếu có
        return res.status(500).json(err);
    }
};


const updateChapter = async (req, res) => {
    const chapter = req.chapter;
    try {
        console.log('Chapter:', chapter);
        if (!chapter || !chapter._id) {
            throw new Error('Chapter or chapter ID is undefined.');
        }
        
        const updatedChapter = await chapterModel.findByIdAndUpdate(
            chapter._id,
            req.body,
            { new: true }
        );
        console.log('Chapter updated:', updatedChapter);
        return res.status(200).json(updatedChapter);
    } catch (err) {
        console.error('Error updating chapter:', err);
        return res.status(500).json(err);
    }
};


// Duyệt một chương
const approveChapter = async (req, res) => {
    const chapterId = req.params.chapterId;
    try {
        const updatedChapter = await chapterModel.findByIdAndUpdate(
            chapterId,
            { approved: true },
            { new: true }
        );
        return res.status(200).json(updatedChapter);
    } catch (err) {
        return res.status(500).json(err);
    }
};
const getChapters = async (req, res) => {
    const { approved } = req.query;
    console.log('Received query parameter approved:', approved);  // Log query parameter

    try {
        const approvedStatus = approved === 'false' ? false : true;
        console.log('Querying chapters with approved status:', approvedStatus);  // Log the approved status used for querying

        // Thực hiện join với collection Story để lấy thông tin về tên của story
        const chapters = await chapterModel.aggregate([
            {
                $match: { approved: approvedStatus }
            },
            {
                $lookup: {
                    from: "Story",
                    localField: "story",
                    foreignField: "_id",
                    as: "story"
                }
            },
            {
                $unwind: "$story"
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    order: 1,
                    readTime: 1,
                    approved: 1,
                    "story.title": 1 // Chọn chỉ tên của story
                }
            }
        ]);

        console.log('Found chapters:', chapters);  // Log the chapters found

        res.status(200).json(chapters);
    } catch (err) {
        console.error('Error fetching chapters:', err);  // Log any error encountered
        res.status(500).json(err);
    }
};


module.exports.getChapters = getChapters;


module.exports.getChapters = getChapters;


module.exports.approveChapter = approveChapter;
module.exports.getChapter = getChapter;
module.exports.getStoryChapters = getStoryChapters;
module.exports.createChapter = createChapter;
module.exports.deleteChapter = deleteChapter;
module.exports.updateChapter = updateChapter;