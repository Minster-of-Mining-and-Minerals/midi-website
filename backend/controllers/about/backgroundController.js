// controllers/backgroundController.js
"use strict";
const {
    Background,
    BackgroundAttachment,
    Attachment,
    sequelize,
} = require("../../models");
const { v4: uuidv4, validate: isUuid } = require("uuid");

// ===========================
// CREATE BACKGROUND
// ===========================
const createBackground = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { title, description, icon, title_am, description_am } = req.body;

        if (!title) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: "Title is required.",
            });
        }

        const background = await Background.create(
            {
                background_id: uuidv4(),
                title,
                description,
                icon,
                content: "",
                title_am: title_am || null,
                description_am: description_am || null,
            },
            { transaction: t }
        );

        await t.commit();
        return res.status(201).json({
            success: true,
            message: "Background created successfully",
            data: background,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Create Background Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create background",
            error: error.message,
        });
    }
};

// ===========================
// GET ALL BACKGROUNDS
// ===========================
const getAllBackgrounds = async (req, res) => {
    try {
        const backgrounds = await Background.findAll();

        return res.status(200).json({
            success: true,
            message: "Backgrounds fetched successfully",
            count: backgrounds.length,
            data: backgrounds,
        });
    } catch (error) {
        console.error("Fetch Backgrounds Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch backgrounds",
            error: error.message,
        });
    }
};

// ===========================
// GET BACKGROUND BY ID
// ===========================
const getBackgroundById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isUuid(id)) {
            return res.status(400).json({ success: false, message: "Invalid background ID." });
        }

        const background = await Background.findByPk(id);

        if (!background) {
            return res.status(404).json({ success: false, message: "Background not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Background fetched successfully",
            data: background,
        });
    } catch (error) {
        console.error("Get Background Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch background",
            error: error.message,
        });
    }
};

// ===========================
// UPDATE BACKGROUND
// ===========================
const updateBackground = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { title, description, icon, title_am, description_am } = req.body;

        const background = await Background.findByPk(id, { transaction: t });
        if (!background) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Background not found." });
        }

        // Amharic fields only change when sent ("" clears them)
        await background.update(
            {
                title,
                description,
                icon,
                content: "",
                ...(title_am !== undefined && { title_am: title_am || null }),
                ...(description_am !== undefined && { description_am: description_am || null }),
            },
            { transaction: t }
        );

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "Background updated successfully",
            data: background,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Update Background Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update background",
            error: error.message,
        });
    }
};

// ===========================
// DELETE BACKGROUND (soft delete)
// ===========================
const deleteBackground = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const background = await Background.findByPk(id, { transaction: t });
        if (!background) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Background not found." });
        }

        await background.destroy({ transaction: t }); // or use paranoid soft delete
        await t.commit();

        return res.status(200).json({
            success: true,
            message: "Background deleted successfully",
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Delete Background Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete background",
            error: error.message,
        });
    }
};

module.exports = {
    createBackground,
    getAllBackgrounds,
    getBackgroundById,
    updateBackground,
    deleteBackground,
};