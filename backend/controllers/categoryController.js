const Category = require("../models/Category");

const createCategory = async(req, res) => {
    const newCategory = new Category({
        name: req.body.name,
    });
    try {
        const savedCategory = await newCategory.save();
        return res.status(201).json(savedCategory);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getCategories = async(req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (err) {
        return res.status(500).json(err);
    } 
};

const getCategory = async (req, res) => {
    const categoryIds = req.params.categoryId.split(','); // Lấy danh sách id category từ tham số trong URL
    try {
        const categories = await Category.find({ _id: { $in: categoryIds } }); // Tìm các category dựa trên danh sách id
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'Categories not found' }); // Nếu không tìm thấy, trả về lỗi 404
        }
        return res.status(200).json(categories); // Nếu tìm thấy, trả về danh sách category
    } catch (err) {
        return res.status(500).json(err); // Nếu có lỗi xảy ra, trả về lỗi 500
    }
};


const deleteCategory = async(req, res) => {
    const category = req.category;
    try {
        const deletedCategory = await Category.findByIdAndDelete(category._id);
        return res.status(200).json(deletedCategory);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateCategory = async(req, res) => {
    const category = req.category;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            category._id,
            req.body, {
                new: true,
            }
        );
        return res.status(200).json(updatedCategory);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports.getCategory = getCategory;
module.exports.getCategories = getCategories;
module.exports.createCategory = createCategory;
module.exports.deleteCategory = deleteCategory;
module.exports.updateCategory = updateCategory;