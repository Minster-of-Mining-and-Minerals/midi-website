"use strict";
const Joi = require("joi");

// Attachment object schema
const attachmentSchema = Joi.object({
    attachment_id: Joi.string()
        .guid({ version: "uuidv4" })
        .required(),
});

// =================== Create Leadership Schema ===================
const createLeadershipSchema = Joi.object({
    header: Joi.string().max(255).optional(),
    parent_id: Joi.string()
        .guid({ version: "uuidv4" })
        .allow(null)
        .optional(),
    name: Joi.string().min(2).max(255).required(),
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().allow("", null).optional(),
    level: Joi.number().integer().min(1).optional(),
    attachments: Joi.array()
        .items(attachmentSchema)
        .optional(),
});

// =================== Update Leadership Schema ===================
const updateLeadershipSchema = Joi.object({
    header: Joi.string().max(255).optional(),
    parent_id: Joi.string()
        .guid({ version: "uuidv4" })
        .allow(null)
        .optional(),
    name: Joi.string().min(2).max(255).optional(),
    title: Joi.string().min(2).max(255).optional(),
    description: Joi.string().allow("", null).optional(),
    level: Joi.number().integer().min(1).optional(),
    attachments: Joi.array()
        .items(attachmentSchema)
        .optional(),
});

// =================== Middleware ===================
exports.validateCreateLeadership = (req, res, next) => {
    const { error } = createLeadershipSchema.validate(req.body, { abortEarly: true });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }
    next();
};

exports.validateUpdateLeadership = (req, res, next) => {
    const { error } = updateLeadershipSchema.validate(req.body, { abortEarly: true });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }
    next();
};