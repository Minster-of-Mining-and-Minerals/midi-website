// controllers/leadershipController.js
"use strict";

const { Leadership, LeadershipAttachment, Attachment, sequelize } = require("../../models");
const { v4: uuidv4, validate: isUuid } = require("uuid");

// ===========================
// CREATE LEADERSHIP
// ===========================
const createLeadership = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { header, parent_id, name, title, description, level, attachments, name_am, title_am, description_am, display_order } = req.body;

        if (!name || !title) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Name and title are required." });
        }

        const leadership = await Leadership.create(
            {
                leadership_id: uuidv4(),
                header,
                parent_id,
                name,
                title,
                description,
                level,
                name_am: name_am || null,
                title_am: title_am || null,
                description_am: description_am || null,
                display_order: display_order ?? 0,
            },
            { transaction: t }
        );

        // Attachments
        if (Array.isArray(attachments) && attachments.length > 0) {
            const attachmentRows = normalizeAttachments(attachments).map(row => ({
                ...row,
                leadership_id: leadership.leadership_id,
            }));

            await LeadershipAttachment.bulkCreate(attachmentRows, { transaction: t });
        }

        await t.commit();
        return res.status(201).json({
            success: true,
            message: "Leadership created successfully",
            data: leadership,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Create Leadership Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create leadership",
            error: error.message,
        });
    }
};

// ===========================
// GET ALL LEADERSHIPS
// ===========================
const getAllLeaderships = async (req, res) => {
    try {
        const leaderships = await Leadership.findAll({
            include: [
                {
                    model: LeadershipAttachment,
                    as: "attachments",
                    include: [{ model: Attachment, as: "attachment" }],
                },
            ],
            // Siblings by their admin-set position; ties keep the previous newest-first order
            order: [
                ["display_order", "ASC"],
                ["created_at", "DESC"],
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Leaderships fetched successfully",
            count: leaderships.length,
            data: leaderships,
        });
    } catch (error) {
        console.error("Fetch Leaderships Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch leaderships",
            error: error.message,
        });
    }
};

// ===========================
// GET LEADERSHIP BY ID
// ===========================
const getLeadershipById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isUuid(id)) {
            return res.status(400).json({ success: false, message: "Invalid leadership ID." });
        }

        const leadership = await Leadership.findByPk(id, {
            include: [
                {
                    model: LeadershipAttachment,
                    as: "attachments",
                    include: [{ model: Attachment, as: "attachment" }],
                },
            ],
        });

        if (!leadership) {
            return res.status(404).json({ success: false, message: "Leadership not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Leadership fetched successfully",
            data: leadership,
        });
    } catch (error) {
        console.error("Get Leadership Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch leadership",
            error: error.message,
        });
    }
};

// ===========================
// UPDATE LEADERSHIP
// ===========================
const updateLeadership = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { header, parent_id, name, title, description, level, attachments, name_am, title_am, description_am, display_order } = req.body;

        const leadership = await Leadership.findByPk(id, { transaction: t });
        if (!leadership) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Leadership not found." });
        }

        // Amharic fields and order only change when sent ("" clears the text)
        await leadership.update(
            {
                header,
                parent_id,
                name,
                title,
                description,
                level,
                ...(name_am !== undefined && { name_am: name_am || null }),
                ...(title_am !== undefined && { title_am: title_am || null }),
                ...(description_am !== undefined && { description_am: description_am || null }),
                ...(display_order !== undefined && { display_order }),
            },
            { transaction: t }
        );

        // Update attachments if provided
        if (Array.isArray(attachments)) {
            await LeadershipAttachment.destroy({
                where: { leadership_id: id },
                transaction: t,
            });

            const attachmentRows = normalizeAttachments(attachments).map(row => ({
                ...row,
                leadership_id: id,
            }));

            if (attachmentRows.length > 0) {
                await LeadershipAttachment.bulkCreate(attachmentRows, { transaction: t });
            }
        }

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "Leadership updated successfully",
            data: leadership,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Update Leadership Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update leadership",
            error: error.message,
        });
    }
};

// ===========================
// DELETE LEADERSHIP (soft delete)
// ===========================
const deleteLeadership = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const leadership = await Leadership.findByPk(id, { transaction: t });
        if (!leadership) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Leadership not found." });
        }

        await leadership.destroy({ transaction: t }); // soft delete (paranoid: true)
        await t.commit();

        return res.status(200).json({
            success: true,
            message: "Leadership deleted successfully",
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Delete Leadership Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete leadership",
            error: error.message,
        });
    }
};

module.exports = {
    createLeadership,
    getAllLeaderships,
    getLeadershipById,
    updateLeadership,
    deleteLeadership,
};


const normalizeAttachments = (attachments = []) =>
    attachments
        .filter(a => a?.attachment_id)
        .map(a => ({
            leadership_attachment_id: uuidv4(),
            attachment_id: a.attachment_id,
            created_at: new Date(),
        }));