"use strict";

const Joi = require("joi");
const { validate: isUuid } = require("uuid");

/* ================= COMMON ================= */

const uuidSchema = Joi.string().custom((value, helpers) => {
    if (!isUuid(value)) return helpers.error("any.invalid");
    return value;
}).messages({
    "any.invalid": "Must be a valid UUID.",
});

const attachmentSchema = Joi.object({
    attachment_id: uuidSchema.required(),
    label: Joi.string().min(1).max(100).required().messages({
        "string.empty": "Attachment label is required.",
        "any.required": "Attachment label is required.",
    }),
});

/* ================= CREATE RESOURCE ================= */

const createResourceSchema = Joi.object({
    sector: Joi.string()
        .valid("mining", "geology", "petroleum", "other")
        .required()
        .messages({
            "any.only": "Invalid sector value.",
        }),

    title: Joi.string().min(5).required().messages({
        "string.empty": "Title is required.",
        "string.min": "Title must be at least 5 characters.",
    }),

    description: Joi.string().allow("", null).optional(),

    attachments: Joi.array()
        .items(attachmentSchema)
        .optional()
        .default([]),
});

/* ================= UPDATE RESOURCE ================= */

const updateResourceSchema = Joi.object({
    sector: Joi.string()
        .valid("mining", "geology", "petroleum", "other")
        .optional(),

    title: Joi.string().min(5).optional(),

    description: Joi.string().allow("", null).optional(),

    attachments: Joi.array()
        .items(attachmentSchema)
        .optional(),
});

/* ================= MIDDLEWARE ================= */

exports.validateCreateResource = (req, res, next) => {
    const { error } = createResourceSchema.validate(req.body, {
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

exports.validateUpdateResource = (req, res, next) => {
    const { error } = updateResourceSchema.validate(req.body, {
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