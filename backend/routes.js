const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');
const storyController = require('./controllers/storyController');
const adminController = require('./controllers/adminController');
const commentController = require('./controllers/commentController');
const authenticateUser = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

// User routes
router.post('/users/register', userController.register);
router.post('/users/login',  userController.login);
router.get('/users/logout',authenticateUser, userController.logout);

// Story routes
router.get('/stories', authenticateUser, storyController.getAllStories);
router.post('/stories', authenticateUser, storyController.createStory);
router.get('/stories/:id', authenticateUser, storyController.getStoryById);

// Admin routes
router.post('/admin/approveStory', authenticateUser, adminMiddleware, adminController.approveStory);
router.post('/admin/createAdmin', authenticateUser, adminMiddleware, adminController.createAdmin);

// Comment routes
router.post('/stories/:storyId/comments', authenticateUser, commentController.createComment);
router.get('/stories/:storyId/comments', authenticateUser, commentController.getCommentsForStory);

// Profile routes
router.put('/profile', authenticateUser, userController.updateProfile);

// Delete routes
router.delete('/comments/:commentId', authenticateUser, commentController.deleteComment);
router.delete('/stories/:id', authenticateUser, storyController.deleteStory);

module.exports = router;
