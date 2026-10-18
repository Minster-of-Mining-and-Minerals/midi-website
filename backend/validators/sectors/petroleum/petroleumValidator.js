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

const attachmentSchema = Joi.object({
    attachment_id: uuidSchema.required(),
    label: Joi.string().min(1).max(100).required().messages({
        "string.empty": "Attachment label is required.",
        "any.required": "Attachment label is required.",
    }),
});

/* ================= CREATE OBJECTIVE ================= */

const createPetroleumObjectiveSchema = Joi.object({
    title: Joi.string().min(5).required().messages({
        "string.empty": "Title is required.",
        "string.min": "Title must be at least 5 characters.",
    }),

    type: Joi.string().valid("headline", "others").required().messages({
        "any.only": "Type must be either 'headline' or 'others'.",
        "any.required": "Type is required.",
    }),

    description: Joi.string().allow("", null).optional(),

    content: Joi.string().optional().allow("", null),

    objectives: Joi.array()
        .items(Joi.string().min(1))
        .optional()
        .default([])
        .messages({
            "array.base": "Objectives must be an array of strings.",
        }),

    attachments: Joi.array()
        .items(attachmentSchema)
        .optional()
        .default([]),
});

/* ================= UPDATE OBJECTIVE ================= */

const updatePetroleumObjectiveSchema = Joi.object({
    title: Joi.string().min(5).optional(),

    type: Joi.string().valid("headline", "others").optional(),

    description: Joi.string().allow("", null).optional(),

    content: Joi.string().optional().allow("", null),

    objectives: Joi.array()
        .items(Joi.string().min(1))
        .optional(),

    attachments: Joi.array()
        .items(attachmentSchema)
        .optional(),
});

/* ================= MIDDLEWARE ================= */

exports.validateCreatePetroleumObjective = (req, res, next) => {
    const { error } = createPetroleumObjectiveSchema.validate(req.body, {
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

exports.validateUpdatePetroleumObjective = (req, res, next) => {
    const { error } = updatePetroleumObjectiveSchema.validate(req.body, {
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