// routes/background/backgroundRoutes.js
"use strict";
const express = require("express");
const router = express.Router();

const {
    validateCreateBackground,
    validateUpdateBackground,
} = require("../../validators/about/backgroundValidator");

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");

const {
    createBackground,
    getAllBackgrounds,
    getBackgroundById,
    updateBackground,
    deleteBackground,
} = require("../../controllers/about/backgroundController");

// ===========================
// Background CRUD
// ===========================
router.post("/", authenticateToken, checkPermission("about", "update"), validateCreateBackground, createBackground);
router.get("/", getAllBackgrounds);
router.get("/:id", getBackgroundById);
router.put("/:id", authenticateToken, checkPermission("about", "update"), validateUpdateBackground, updateBackground);
router.delete("/:id", authenticateToken, checkPermission("about", "delete"), deleteBackground);

/**
 * @swagger
 * tags:
 *   name: Backgrounds
 *   description: Manage backgrounds and attachments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Background:
 *       type: object
 *       properties:
 *         background_id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         icon:
 *           type: string
 *         content:
 *           type: string
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
 * /api/backgrounds:
 *   post:
 *     summary: Create a new background
 *     tags: [Backgrounds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Background'
 *     responses:
 *       201:
 *         description: Background created successfully
 *       400:
 *         description: Invalid payload
 *
 *   get:
 *     summary: Get all backgrounds
 *     tags: [Backgrounds]
 *     responses:
 *       200:
 *         description: List of backgrounds
 */

/**
 * @swagger
 * /api/backgrounds/{id}:
 *   get:
 *     summary: Get a specific background by ID
 *     tags: [Backgrounds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Background found
 *       404:
 *         description: Background not found
 *
 *   put:
 *     summary: Update a background
 *     tags: [Backgrounds]
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
 *             $ref: '#/components/schemas/Background'
 *     responses:
 *       200:
 *         description: Updated successfully
 *
 *   delete:
 *     summary: Delete a background
 *     tags: [Backgrounds]
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

module.exports = router;