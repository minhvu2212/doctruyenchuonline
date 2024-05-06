const chapterModel = require("../models/Chapter");

const chapterMiddleware = async (req, res, next) => {
    const chapterId = req.params.chapterId;
    console.log("Chapter ID:", chapterId); // Kiểm tra giá trị của chapterId
    try {
        const chapter = await chapterModel.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found1" });
        }
        req.chapter = chapter;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports = 
    chapterMiddleware ;

