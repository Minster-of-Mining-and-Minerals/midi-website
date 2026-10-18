"use strict";

const Joi = require("joi");
const { validate: isUuid } = require("uuid");

/* ================= COMMON ================= */

const uuidSchema = Joi.string()
    .custom((value, helpers) => {
        if (!isUuid(value)) return helpers.error("any.invalid");
        return value;
    })
    .messages({
        "any.invalid": "Must be a valid UUID.",
    });

/* ================= STEP ================= */

const stepSchema = Joi.object({
    description: Joi.string().allow("", null).optional(),

    attachment_id: uuidSchema.required().messages({
        "any.required": "Attachment ID is required for each step.",
    }),

    order: Joi.number().integer().optional(),
});

/* ================= PROCESS STEP ================= */

const processStepSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        "string.empty": "Process step title is required.",
    }),

    description: Joi.string().optional().allow("", null),

    content: Joi.string().optional().allow("", null),

    steps: Joi.array()
        .items(stepSchema)
        .optional()
        .default([]),
});

/* ================= BLOCK ATTACHMENT ================= */

const processBlockAttachmentSchema = Joi.object({
    attachment_id: uuidSchema.required().messages({
        "any.required": "Attachment ID is required.",
    }),

    label: Joi.string().min(1).required().messages({
        "string.empty": "Attachment label is required.",
    }),
});

/* ================= PROCESS BLOCK ================= */

const processBlockSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        "string.empty": "Block title is required.",
    }),

    description: Joi.string().optional().allow("", null),

    content: Joi.string().optional().allow("", null),

    attachments: Joi.array()
        .items(processBlockAttachmentSchema)
        .optional()
        .default([]),
});

/* ================= CREATE PROCESS ================= */

const createPetroleumProcessSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty": "Title is required.",
        "string.min": "Title must be at least 3 characters.",
    }),

    description: Joi.string().optional().allow("", null),

    process_steps: Joi.array()
        .items(processStepSchema)
        .optional()
        .default([]),

    /* 🔥 NEW FIELD */
    process_blocks: Joi.array()
        .items(processBlockSchema)
        .optional()
        .default([]),
});

/* ================= UPDATE PROCESS ================= */

const updatePetroleumProcessSchema = Joi.object({
    title: Joi.string().min(3).optional(),

    description: Joi.string().optional().allow("", null),

    process_steps: Joi.array()
        .items(processStepSchema)
        .optional(),

    /* 🔥 NEW FIELD */
    process_blocks: Joi.array()
        .items(processBlockSchema)
        .optional(),
});

/* ================= MIDDLEWARE ================= */

exports.validateCreatePetroleumProcess = (req, res, next) => {
    const { error } = createPetroleumProcessSchema.validate(req.body, {
        abortEarly: true,
        allowUnknown: false,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};

exports.validateUpdatePetroleumProcess = (req, res, next) => {
    const { error } = updatePetroleumProcessSchema.validate(req.body, {
        abortEarly: true,
        allowUnknown: false,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};