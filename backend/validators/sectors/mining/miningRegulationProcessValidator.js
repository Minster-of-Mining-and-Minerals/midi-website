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

/* ================= FRAMEWORK ================= */

const frameworkSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty": "Framework title is required.",
        "string.min": "Framework title must be at least 3 characters.",
    }),

    description: Joi.string().allow("", null).optional(),

    objectives: Joi.array().items(Joi.string()).optional().default([]),

    attachment_id: uuidSchema.optional().allow(null),

    attachment_overlay_text: Joi.string().optional().default("Mining Framework"),

    attachment_overlay_color: Joi.string().optional().default("#ffffff"),
});

/* ================= GUIDELINE CONTENT ================= */

const guidelineContentSchema = Joi.object({
    type: Joi.string().valid("card", "bullet", "others").default("others").messages({
        "any.only": "Type must be one of: card, bullet, others.",
    }),

    bg_color: Joi.string().optional().allow(null, ""),

    icon: Joi.string().optional().allow(null, ""),

    stamp: Joi.string().optional().allow(null, ""),

    title: Joi.string().min(1).required().messages({
        "string.empty": "Content title is required.",
    }),

    description: Joi.string().optional().allow(null, ""),
});

/* ================= GUIDELINE ATTACHMENT ================= */

const guidelineAttachmentSchema = Joi.object({
    attachment_id: uuidSchema.required().messages({
        "any.required": "Attachment ID is required.",
    }),

    label: Joi.string().min(1).required().messages({
        "string.empty": "Attachment label is required.",
    }),
});

/* ================= GUIDELINE ================= */

const guidelineSchema = Joi.object({
    icon: Joi.string().optional().allow(null, ""),

    title: Joi.string().min(3).required().messages({
        "string.empty": "Guideline title is required.",
        "string.min": "Guideline title must be at least 3 characters.",
    }),

    description: Joi.string().optional().allow(null, ""),

    contents: Joi.array().items(guidelineContentSchema).optional().default([]),

    attachments: Joi.array().items(guidelineAttachmentSchema).optional().default([]),
});

/* ================= SERVICE CARD ================= */

const serviceCardSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty": "Service card title is required.",
        "string.min": "Service card title must be at least 3 characters.",
    }),

    sub_title: Joi.string().optional().allow(null, ""),

    sub_title_color: Joi.string().optional().default("#f8f521ff"),

    icon: Joi.string().optional().allow(null, ""),

    description: Joi.string().allow("", null).optional(),

    requirements: Joi.array().items(Joi.string()).optional().default([]),
});

/* ================= SERVICE ================= */

const serviceSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty": "Service title is required.",
        "string.min": "Service title must be at least 3 characters.",
    }),

    description: Joi.string().optional().allow(null, ""),

    service_cards: Joi.array().items(serviceCardSchema).optional().default([]),
});

/* ================= CREATE REGULATION PROCESS ================= */

const createMiningRegulationProcessSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty": "Title is required.",
        "string.min": "Title must be at least 3 characters.",
    }),

    description: Joi.string().allow("", null).optional(),

    publish: Joi.boolean().optional().default(false),

    frameworks: Joi.array().items(frameworkSchema).optional().default([]),

    guidelines: Joi.array().items(guidelineSchema).optional().default([]),

    services: Joi.array().items(serviceSchema).optional().default([]),
});

/* ================= UPDATE REGULATION PROCESS ================= */

const updateMiningRegulationProcessSchema = Joi.object({
    title: Joi.string().min(3).optional().messages({
        "string.min": "Title must be at least 3 characters.",
    }),

    description: Joi.string().allow("", null).optional(),

    publish: Joi.boolean().optional(),

    frameworks: Joi.array().items(frameworkSchema).optional(),

    guidelines: Joi.array().items(guidelineSchema).optional(),

    services: Joi.array().items(serviceSchema).optional(),
});

/* ================= TOGGLE PUBLISH ================= */

const togglePublishSchema = Joi.object({
    publish: Joi.boolean().required().messages({
        "any.required": "Publish status is required.",
        "boolean.base": "Publish must be a boolean value.",
    }),
});

/* ================= MIDDLEWARE ================= */

exports.validateCreateMiningRegulationProcess = (req, res, next) => {
    const { error } = createMiningRegulationProcessSchema.validate(req.body, {
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

exports.validateUpdateMiningRegulationProcess = (req, res, next) => {
    const { error } = updateMiningRegulationProcessSchema.validate(req.body, {
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

exports.validateTogglePublish = (req, res, next) => {
    const { error } = togglePublishSchema.validate(req.body, {
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