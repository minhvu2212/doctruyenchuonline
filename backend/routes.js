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
// User routes
router.post('/users/register', userController.register);
router.post('/users/login',  userController.login);
router.get('/users/logout',verifyToken, userController.logout);
// Routes

// Story routes
router.post('/createStory',verifyToken, createStory);

// Lấy danh sách các câu chuyện
router.get('/getStories',verifyToken, getStories);

// Lấy thông tin chi tiết của một câu chuyện
router.get('/getStory/:id',verifyToken, getStory);

// Xóa một câu chuyện
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
