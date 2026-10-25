// validators/background/backgroundValidator.js
"use strict";
const Joi = require("joi");
const { validate: isUuid } = require("uuid");

// ================= COMMON SCHEMAS =================
const uuidSchema = Joi.string().custom((value, helpers) => {
    if (!isUuid(value)) return helpers.error("any.invalid");
    return value;
}).messages({
    "any.invalid": "Must be a valid UUID.",
});

const attachmentSchema = Joi.object({
    attachment_id: uuidSchema.required(),
});

// ================= CREATE BACKGROUND =================
const createBackgroundSchema = Joi.object({
    title: Joi.string().min(5).required().messages({
        "string.empty": "Title is required.",
        "string.min": "Title must be at least 5 characters long.",
    }),
    description: Joi.string().allow("", null).optional(),
    content: Joi.string().allow("").optional(),
    icon: Joi.string().required(),
    title_am: Joi.string().allow("", null).max(255).optional(),
    description_am: Joi.string().allow("", null).optional(),
});

// ================= UPDATE BACKGROUND =================
const updateBackgroundSchema = Joi.object({
    title: Joi.string().min(5).optional(),
    description: Joi.string().allow("", null).optional(),
    content: Joi.string().allow("").optional(),
    icon: Joi.string().optional(),
    title_am: Joi.string().allow("", null).max(255).optional(),
    description_am: Joi.string().allow("", null).optional(),
});

// ================= MIDDLEWARES =================
exports.validateCreateBackground = (req, res, next) => {
    const { error } = createBackgroundSchema.validate(req.body, {
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

exports.validateUpdateBackground = (req, res, next) => {
    const { error } = updateBackgroundSchema.validate(req.body, {
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