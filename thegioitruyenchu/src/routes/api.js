const express = require('express');
const router = express.Router();

// Import các controller
const userController = require('../controllers/userController');
const storyController = require('../controllers/storyController');
const adminController = require('../controllers/adminController');
const commentController = require('../controllers/commentController');
const categoryController = require('../controllers/categoryController');
const tagController = require('../controllers/tagController');
const chapterController = require('../controllers/chapterController');
const readController = require('../controllers/readController');
const bookmarkController = require('../controllers/bookmarkController');

// Import các middleware
const isAdmin = require("../middlewares/isAdmin");
const verifyToken = require("../middlewares/verifyToken");
const isStoryOwner = require("../middlewares/isStoryOwner");

// Định nghĩa các routes

// User routes
router.post('/users/register', userController.register);
router.post('/users/login',  userController.login);
router.get('/users/logout', userController.logout);
router.put('/profile', verifyToken, userController.updateProfile);

// Category routes
router.post('/categories', verifyToken, categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:categoryId', categoryController.getCategory);
router.delete('/categories/:categoryId', verifyToken, categoryController.deleteCategory);
router.put('/categories/:categoryId', verifyToken, categoryController.updateCategory);

// Tag routes
router.post('/tags', verifyToken, tagController.createTag);
router.get('/tags', verifyToken, tagController.getTags);
router.get('/tags/:id', verifyToken, tagController.getTag);
router.delete('/tags/:id', verifyToken, tagController.deleteTag);
router.put('/tags/:id', verifyToken, tagController.updateTag);

// Story routes
router.post('/stories', verifyToken, storyController.createStory);
router.get('/stories', verifyToken, storyController.getStories);
router.get('/stories/:id', verifyToken, storyController.getStory);
router.delete('/stories/:id', verifyToken, isStoryOwner, storyController.deleteStory);
router.put('/stories/:id', verifyToken, isStoryOwner, storyController.updateStory);

// Chapter routes
router.post('/chapters', verifyToken, chapterController.createChapter);
router.get('/chapters/story/:storyId', verifyToken, chapterController.getStoryChapters);
router.get('/chapters/:chapterId', verifyToken, chapterController.getChapter);
router.delete('/chapters/:chapterId', verifyToken, chapterController.deleteChapter);
router.put('/chapters/:chapterId', verifyToken, chapterController.updateChapter);

// Read routes
router.post('/chapters/:chapterId/read', verifyToken, readController.readChapter);

// Bookmark routes
router.post('/stories/:storyId/bookmark', verifyToken, bookmarkController.bookmarkStory);
router.delete('/stories/:storyId/bookmark', verifyToken, bookmarkController.unbookmarkStory);

// Admin routes
router.post('/admin/approveStory', verifyToken, isAdmin, adminController.approveStory);
router.post('/admin/createAdmin', verifyToken, isAdmin, adminController.createAdmin);

// Comment routes
router.post('/stories/:storyId/comments', verifyToken, commentController.createComment);
router.get('/stories/:storyId/comments', verifyToken, commentController.getCommentsForStory);
router.delete('/comments/:commentId', verifyToken, commentController.deleteComment);

module.exports = router;
