const express = require("express");
const router = express.Router();

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");

const {
  validateCreateStrategy,
  validateUpdateStrategy,
} = require("../../validators/about/strategyValidator");

const {
  createStrategy,
  getAllStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
} = require("../../controllers/about/strategyController");

// ===========================
// Strategy CRUD
// ===========================
router.post("/", authenticateToken, checkPermission("about", "update"), validateCreateStrategy, createStrategy);
router.get("/", getAllStrategies);
router.get("/:id", getStrategyById);
router.put("/:id", authenticateToken, checkPermission("about", "update"), validateUpdateStrategy, updateStrategy);
router.delete("/:id", authenticateToken, checkPermission("about", "delete"), deleteStrategy);

/**
 * @swagger
 * tags:
 *   name: Strategy
 *   description: Manage organizational strategies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CoreValue:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         icon:
 *           type: string
 *         content:
 *           type: string
 *     Section:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [mission, vision, core_values]
 *         title:
 *           type: string
 *         icon:
 *           type: string
 *         content:
 *           type: string
 *         core_values:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CoreValue'
 *     Strategy:
 *       type: object
 *       properties:
 *         strategy_id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         sections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Section'
 */

/**
 * @swagger
 * /api/strategy:
 *   post:
 *     summary: Create a new strategy
 *     tags: [Strategy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Strategy'
 *     responses:
 *       201:
 *         description: Strategy created successfully
 *       400:
 *         description: Invalid payload
 *
 *   get:
 *     summary: Get all strategies
 *     tags: [Strategy]
 *     responses:
 *       200:
 *         description: List of strategies
 */

/**
 * @swagger
 * /api/strategy/{id}:
 *   get:
 *     summary: Get a strategy by ID
 *     tags: [Strategy]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Strategy found
 *       404:
 *         description: Strategy not found
 *
 *   put:
 *     summary: Update a strategy
 *     tags: [Strategy]
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
 *             $ref: '#/components/schemas/Strategy'
 *     responses:
 *       200:
 *         description: Strategy updated successfully
 *
 *   delete:
 *     summary: Delete a strategy
 *     tags: [Strategy]
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
 *         description: Strategy deleted successfully
 */

module.exports = router;
