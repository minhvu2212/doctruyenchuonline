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

const getCategory = async(req, res) => {
    const category = req.category;
    try {
        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json(err);
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