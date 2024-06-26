const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');
const {
    createStory, getStories, getStory, deleteStory, updateStory, userStories
} = require('./controllers/storyController');
const adminController = require('./controllers/adminController');
const commentController = require('./controllers/commentController');
const isAdmin = require("./middlewares/isAdmin");
const verifyToken = require("./middlewares/verifyToken");
const upload = require("./middlewares/multer");
const isStoryOwner = require("./middlewares/isStoryOwner");
const categoryController = require('./controllers/categoryController');
const tagController = require('./controllers/tagController');
const chapterController = require('./controllers/chapterController');
const readController = require('./controllers/readController');
const bookmarkController = require('./controllers/bookmarkController');
const findStoryMiddleware = require('./middlewares/findStoryMiddleware');
const chapterMiddleware = require("./middlewares/chapterMiddleware");
// User routes
router.post('/users/register', userController.register);
router.post('/users/login',  userController.login);
router.get('/users/logout', userController.logout);
router.put('/profile', verifyToken, userController.updateProfile);
router.get('/profile', verifyToken, userController.getProfile);
router.get('/profile/userstories', verifyToken,userStories);
// CategoryRoutes
router.post('/categories', verifyToken, categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:categoryId', categoryController.getCategory);
router.delete('/categories/:categoryId', verifyToken, categoryController.deleteCategory);
router.put('/categories/:categoryId', verifyToken, categoryController.updateCategory);
// Tag
router.post('/tags', verifyToken, tagController.createTag);
router.get('/tags', tagController.getTags);
router.get('/tags/:id', tagController.getTag);
router.delete('/tags/:id', verifyToken, tagController.deleteTag);
router.put('/tags/:id', verifyToken, tagController.updateTag);
// Story routes
router.post('/createStory',verifyToken,upload.single('cover'), createStory);
router.get('/getStories', getStories);
router.get('/getStory/:storyId',findStoryMiddleware, getStory);
router.delete('/deleteStory/:id',verifyToken,isStoryOwner, deleteStory);
router.delete('/deleteStoryadmin/:id',verifyToken,isAdmin, deleteStory);
router.put('/updateStory/:id',verifyToken,isStoryOwner, updateStory);

//Chapter
router.post('/chapters/:storyId', verifyToken,findStoryMiddleware, chapterController.createChapter);
router.get('/chapters/story/:storyId',findStoryMiddleware, chapterController.getStoryChapters);
router.get('/chapters/:chapterId',verifyToken, chapterMiddleware , chapterController.getChapter);
router.delete('/chapters/:chapterId', verifyToken,chapterMiddleware , chapterController.deleteChapter);
router.put('/chapters/:chapterId', verifyToken,chapterMiddleware , chapterController.updateChapter);

// Read
router.post('/chapters/:chapterId/read', verifyToken, readController.readChapter);
//Bookmark
// Đánh dấu một truyện đã được đánh dấu
router.post('/stories/:storyId/bookmark', verifyToken, bookmarkController.bookmarkStory);

// Hủy đánh dấu một truyện
router.delete('/stories/:storyId/bookmark', verifyToken, bookmarkController.unbookmarkStory);
router.get('/getChapters', verifyToken, isAdmin, chapterController.getChapters);

// Admin routes
router.post('/admin/approveStory', verifyToken, isAdmin, adminController.approveStory);
router.post('/admin/createAdmin', verifyToken, isAdmin, adminController.createAdmin);
router.post('/check-content',verifyToken, isAdmin, adminController.checkStoryContent);
router.post('/chapters/:chapterId/approve',verifyToken,isAdmin, chapterController.approveChapter);
// Comment routes
router.post('/stories/:storyId/chapters/:chapterId/comments', verifyToken,findStoryMiddleware,chapterMiddleware, commentController.createComment);
router.get('/stories/:storyId/chapters/:chapterId/comments', verifyToken,findStoryMiddleware,chapterMiddleware, commentController.getCommentsForStory);
router.delete('/comments/:commentId', verifyToken, commentController.deleteComment);

router.get('/isAdmin',verifyToken, adminController.checkAdmin);


module.exports = router;
