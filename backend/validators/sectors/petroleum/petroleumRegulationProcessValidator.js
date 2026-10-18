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

/* ================= REGULATION ================= */

const regulationSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        "string.empty": "Regulation title is required.",
    }),

    description: Joi.string().allow("", null).optional(),

    order: Joi.number().integer().optional(),

    content: Joi.array().optional().default([]),

    objectives: Joi.array().optional().default([]),

    bullet_points: Joi.array().optional().default([]),

    steps: Joi.array().optional().default([]),
});

/* ================= DIRECTIVE ================= */

const directiveSchema = Joi.object({
    title: Joi.string().min(1).required(),

    description: Joi.string().allow("", null).optional(),

    order: Joi.number().integer().optional(),

    type: Joi.string().valid("main", "sub").optional(),

    action_label: Joi.string().allow("", null),

    action: Joi.string().allow("", null),
});

/* ================= ATTACHMENT ================= */

const attachmentSchema = Joi.object({
    attachment_id: uuidSchema.required(),

    label: Joi.string().min(1).required(),
});

/* ================= CREATE ================= */

const createSchema = Joi.object({
    regulations: Joi.array().items(regulationSchema).optional().default([]),

    directives: Joi.array().items(directiveSchema).optional().default([]),

    attachments: Joi.array().items(attachmentSchema).optional().default([]),
});

/* ================= UPDATE ================= */

const updateSchema = Joi.object({
    regulations: Joi.array().items(regulationSchema).optional(),

    directives: Joi.array().items(directiveSchema).optional(),

    attachments: Joi.array().items(attachmentSchema).optional(),
});

/* ================= MIDDLEWARE ================= */

exports.validateCreatePetroleumRegulationProcess = (req, res, next) => {
    const { error } = createSchema.validate(req.body, {
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

exports.validateUpdatePetroleumRegulationProcess = (req, res, next) => {
    const { error } = updateSchema.validate(req.body, {
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