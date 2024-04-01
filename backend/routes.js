const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');
const {
    createStory, getStories, getStory, deleteStory, updateStory
} = require('./controllers/storyController');
const adminController = require('./controllers/adminController');
const commentController = require('./controllers/commentController');
const isAdmin = require("./middlewares/isAdmin");
const verifyToken = require("./middlewares/verifyToken");
const isStoryOwner = require("./middlewares/isStoryOwner");
const categoryController = require('./controllers/categoryController');
const tagController = require('./controllers/tagController');
// User routes
router.post('/users/register', userController.register);
router.post('/users/login',  userController.login);
router.get('/users/logout', userController.logout);
// CategoryRoutes
router.post('/categories', verifyToken, categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:categoryId', categoryController.getCategory);
router.delete('/categories/:categoryId', verifyToken, categoryController.deleteCategory);
router.put('/categories/:categoryId', verifyToken, categoryController.updateCategory);
// Tag
router.post('/tags', verifyToken, tagController.createTag);
router.get('/tags', verifyToken, tagController.getTags);
router.get('/tags/:id', verifyToken, tagController.getTag);
router.delete('/tags/:id', verifyToken, tagController.deleteTag);
router.put('/tags/:id', verifyToken, tagController.updateTag);
// Story routes
router.post('/createStory',verifyToken, createStory);
router.get('/getStories',verifyToken, getStories);
router.get('/getStory/:id',verifyToken, getStory);
router.delete('/deleteStory/:id',verifyToken,isStoryOwner, deleteStory);
router.delete('/deleteStoryadmin/:id',verifyToken,isAdmin, deleteStory);
// Cập nhật thông tin của một câu chuyện
router.put('/updateStory/:id',verifyToken,isStoryOwner, updateStory);

// Admin routes
router.post('/admin/approveStory', verifyToken, isAdmin, adminController.approveStory);
router.post('/admin/createAdmin', verifyToken, isAdmin, adminController.createAdmin);

// Comment routes
router.post('/stories/:storyId/comments', verifyToken, commentController.createComment);
router.get('/stories/:storyId/comments', verifyToken, commentController.getCommentsForStory);

// Profile routes
router.put('/profile', verifyToken, userController.updateProfile);

// Delete routes
router.delete('/comments/:commentId', verifyToken, commentController.deleteComment);


module.exports = router;
