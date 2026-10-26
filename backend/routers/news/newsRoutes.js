const express = require("express");
const router = express.Router();

const {
    validateCreateNews,
    validateUpdateNews,
} = require("../../validators/news/newsValidator");

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");


const {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
    reactToNews,
    recordNewsRead,
    getNewsFeedbacks,
    getNewsFeedbackCount,
    getAllNewsFeedbacks,
    toggleNewsFeedbackStatus,
    deleteNewsFeedback,
    recordNewsFeedback,
} = require("../../controllers/news/newsController");

// ===========================
// News CRUD
// ===========================
router.post("/", authenticateToken, checkPermission("news", "create"), validateCreateNews, createNews);
router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.put("/:id", authenticateToken, checkPermission("news", "update"), validateUpdateNews, updateNews);
router.delete("/:id", authenticateToken, checkPermission("news", "delete"), deleteNews);

const { newsInteractionLimiter } = require("../../middlewares/rateLimitMiddleware");

// ===========================
// News Reactions & Reads
// ===========================
// Public visitor actions: one reaction per IP per article, rate limited per IP; feedback waits for admin approval
router.post("/react", newsInteractionLimiter, reactToNews);
router.post("/read", newsInteractionLimiter, recordNewsRead);
router.post("/feedback", newsInteractionLimiter, recordNewsFeedback);
router.get("/feedback/:news_id", getNewsFeedbacks);
router.get("/feedback/count/:news_id", getNewsFeedbackCount);

// Admin Feedback Management
router.get("/admin/feedback/all", authenticateToken, getAllNewsFeedbacks);
router.patch("/admin/feedback/:id/toggle", authenticateToken, checkPermission("news", "update"), toggleNewsFeedbackStatus);
router.delete("/admin/feedback/:id", authenticateToken, checkPermission("news", "delete"), deleteNewsFeedback);

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Manage news posts, tags, attachments, reactions, and reads
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         news_id:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         deleted_at:
 *           type: string
 *           format: date-time
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               attachment_id:
 *                 type: string
 *               category:
 *                 type: string
 *         tag_links:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               tag_id:
 *                 type: string
 *               tag:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *
 *     CreateNewsRequest:
 *       type: object
 *       required:
 *         - description
 *       properties:
 *         description:
 *           type: string
 *         attachment_ids:
 *           type: array
 *           items:
 *             type: string
 *         tag_ids:
 *           type: array
 *           items:
 *             type: string
 *
 *     UpdateNewsRequest:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         attachment_ids:
 *           type: array
 *           items:
 *             type: string
 *         tag_ids:
 *           type: array
 *           items:
 *             type: string
 *
 *     NewsReactionRequest:
 *       type: object
 *       required:
 *         - news_id
 *         - reaction
 *       properties:
 *         news_id:
 *           type: string
 *         reaction:
 *           type: string
 *           enum: [like, dislike]
 *
 *     NewsReadRequest:
 *       type: object
 *       required:
 *         - news_id
 *         - read_time
 *       properties:
 *         news_id:
 *           type: string
 *         read_time:
 *           type: number
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a new news post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNewsRequest'
 *     responses:
 *       201:
 *         description: News created successfully
 *       400:
 *         description: Invalid payload
 *
 *   get:
 *     summary: Get all news posts (optional search & tag filter)
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of news posts
 */

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get a specific news post by ID
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News found
 *       404:
 *         description: News not found
 *
 *   put:
 *     summary: Update a news post (description, attachments, tags)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNewsRequest'
 *     responses:
 *       200:
 *         description: Updated successfully
 *
 *   delete:
 *     summary: Soft delete a news post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /api/news/react:
 *   post:
 *     summary: React to a news post (like/dislike)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsReactionRequest'
 *     responses:
 *       200:
 *         description: Reaction recorded
 *
 * /api/news/read:
 *   post:
 *     summary: Record reading time for a news post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsReadRequest'
 *     responses:
 *       200:
 *         description: Read time recorded
 */

module.exports = router;
