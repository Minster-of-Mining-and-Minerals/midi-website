"use strict";

const { Certification, CertificationAttachment, Attachment, sequelize } = require("../../models");
const { v4: uuidv4, validate: isUuid } = require("uuid");

const normalizeAttachments = (attachments = []) =>
    attachments
        .filter((a) => a?.attachment_id)
        .map((a) => ({
            certification_attachment_id: uuidv4(),
            attachment_id: a.attachment_id,
            created_at: new Date(),
        }));

// ===========================
// CREATE CERTIFICATION
// ===========================
const createCertification = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { title, description, order, is_active, attachments, title_am, description_am } = req.body;

        if (!title) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Title is required." });
        }

        const certification = await Certification.create(
            {
                certification_id: uuidv4(),
                title,
                description,
                order: order || 0,
                title_am: title_am || null,
                description_am: description_am || null,
                is_active: is_active !== undefined ? is_active : true,
            },
            { transaction: t }
        );

        // Attachments
        if (Array.isArray(attachments) && attachments.length > 0) {
            const attachmentRows = normalizeAttachments(attachments).map((row) => ({
                ...row,
                certification_id: certification.certification_id,
            }));

            await CertificationAttachment.bulkCreate(attachmentRows, { transaction: t });
        }

        await t.commit();
        return res.status(201).json({
            success: true,
            message: "Certification created successfully",
            data: certification,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Create Certification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create certification",
            error: error.message,
        });
    }
};

// ===========================
// GET ALL CERTIFICATIONS
// ===========================
const getAllCertifications = async (req, res) => {
    try {
        const certifications = await Certification.findAll({
            include: [
                {
                    model: CertificationAttachment,
                    as: "attachments",
                    include: [{ model: Attachment, as: "attachment" }],
                },
            ],
            order: [
                ["order", "ASC"],
                ["created_at", "DESC"],
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Certifications fetched successfully",
            count: certifications.length,
            data: certifications,
        });
    } catch (error) {
        console.error("Fetch Certifications Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch certifications",
            error: error.message,
        });
    }
};

// ===========================
// GET CERTIFICATION BY ID
// ===========================
const getCertificationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isUuid(id)) {
            return res.status(400).json({ success: false, message: "Invalid certification ID." });
        }

        const certification = await Certification.findByPk(id, {
            include: [
                {
                    model: CertificationAttachment,
                    as: "attachments",
                    include: [{ model: Attachment, as: "attachment" }],
                },
            ],
        });

        if (!certification) {
            return res.status(404).json({ success: false, message: "Certification not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Certification fetched successfully",
            data: certification,
        });
    } catch (error) {
        console.error("Get Certification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch certification",
            error: error.message,
        });
    }
};

// ===========================
// UPDATE CERTIFICATION
// ===========================
const updateCertification = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { title, description, order, is_active, attachments, title_am, description_am } = req.body;

        const certification = await Certification.findByPk(id, { transaction: t });
        if (!certification) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Certification not found." });
        }

        // Amharic fields only change when sent ("" clears them)
        await certification.update(
            {
                title,
                description,
                order,
                is_active,
                ...(title_am !== undefined && { title_am: title_am || null }),
                ...(description_am !== undefined && { description_am: description_am || null }),
            },
            { transaction: t }
        );

        // Update attachments if provided
        if (Array.isArray(attachments)) {
            await CertificationAttachment.destroy({
                where: { certification_id: id },
                transaction: t,
            });

            const attachmentRows = normalizeAttachments(attachments).map((row) => ({
                ...row,
                certification_id: id,
            }));

            if (attachmentRows.length > 0) {
                await CertificationAttachment.bulkCreate(attachmentRows, { transaction: t });
            }
        }

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "Certification updated successfully",
            data: certification,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Update Certification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update certification",
            error: error.message,
        });
    }
};

// ===========================
// DELETE CERTIFICATION
// ===========================
const deleteCertification = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const certification = await Certification.findByPk(id, { transaction: t });
        if (!certification) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Certification not found." });
        }

        await certification.destroy({ transaction: t });
        await t.commit();

        return res.status(200).json({
            success: true,
            message: "Certification deleted successfully",
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error("Delete Certification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete certification",
            error: error.message,
        });
    }
};

module.exports = {
    createCertification,
    getAllCertifications,
    getCertificationById,
    updateCertification,
    deleteCertification,
};
