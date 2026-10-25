const express = require("express");
const router = express.Router();

const {
    validateCreateLeadership,
    validateUpdateLeadership,
} = require("../../validators/about/leadershipValidator");

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");

const {
    createLeadership,
    getAllLeaderships,
    getLeadershipById,
    updateLeadership,
    deleteLeadership,
} = require("../../controllers/about/leadershipController");

// ===========================
// Leadership CRUD
// ===========================
router.post("/", authenticateToken, checkPermission("about", "update"), validateCreateLeadership, createLeadership);
router.get("/", getAllLeaderships);
router.get("/:id", getLeadershipById);
router.put("/:id", authenticateToken, checkPermission("about", "update"), validateUpdateLeadership, updateLeadership);
router.delete("/:id", authenticateToken, checkPermission("about", "delete"), deleteLeadership);

/**
 * @swagger
 * tags:
 *   name: Leadership
 *   description: Manage leadership records
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Leadership:
 *       type: object
 *       properties:
 *         leadership_id:
 *           type: string
 *         header:
 *           type: string
 *         parent_id:
 *           type: string
 *         name:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         level:
 *           type: integer
 *         is_active:
 *           type: boolean
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               attachment_id:
 *                 type: string
 */

/**
 * @swagger
 * /api/leadership:
 *   post:
 *     summary: Create a new leadership record
 *     tags: [Leadership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Leadership'
 *     responses:
 *       201:
 *         description: Leadership created successfully
 *       400:
 *         description: Invalid payload
 *
 *   get:
 *     summary: Get all leadership records
 *     tags: [Leadership]
 *     responses:
 *       200:
 *         description: List of leadership records
 */

/**
 * @swagger
 * /api/leadership/{id}:
 *   get:
 *     summary: Get a leadership record by ID
 *     tags: [Leadership]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leadership record found
 *       404:
 *         description: Leadership record not found
 *
 *   put:
 *     summary: Update a leadership record
 *     tags: [Leadership]
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
 *             $ref: '#/components/schemas/Leadership'
 *     responses:
 *       200:
 *         description: Leadership updated successfully
 *
 *   delete:
 *     summary: Delete a leadership record
 *     tags: [Leadership]
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
 *         description: Leadership deleted successfully
 */

module.exports = router;