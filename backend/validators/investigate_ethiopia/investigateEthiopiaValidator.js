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

/* ================= STRATEGY ================= */

const strategySchema = Joi.object({
    investigation_strategy_id: Joi.string().optional(),
    investigate_ethiopia_id: Joi.string().optional(),
    type: Joi.string().optional(),

    icon: Joi.string().allow("", null).optional(),
    title: Joi.string().min(3).required(),
    description: Joi.string().allow("", null).optional(),
    content: Joi.string().allow("", null).optional(),

    tags: Joi.array().items(Joi.string()).allow(null, "").optional(),

    attachment_id: uuidSchema.allow(null).optional(),
    link: Joi.string().allow("", null).optional(),

    bg_color: Joi.string().allow("", null).optional(),
    fg_color: Joi.string().allow("", null).optional(),

    created_at: Joi.any().optional(),
    updated_at: Joi.any().optional(),
    deleted_at: Joi.any().optional(),
});

/* ================= ACTION ================= */

const actionSchema = Joi.object({
    investigation_action_id: Joi.string().optional(),
    investigate_ethiopia_id: Joi.string().optional(),

    title: Joi.string().min(3).required(),
    description: Joi.string().allow("", null).optional(),
    action: Joi.string().min(3).required(),
    link: Joi.string().uri().required(),

    created_at: Joi.any().optional(),
    updated_at: Joi.any().optional(),
    deleted_at: Joi.any().optional(),
});

/* ================= CREATE ================= */

const createSchema = Joi.object({
    headlines: Joi.array().items(strategySchema).optional(),
    strategic_minerals: Joi.array().items(strategySchema).optional(),
    autonomy: Joi.array().items(strategySchema).optional(),
    autonomous_institutions: Joi.array().items(strategySchema).optional(),
    strategic_pillars: Joi.array().items(strategySchema).optional(),
    ambition: Joi.array().items(strategySchema).optional(),
    global_proclamation: Joi.array().items(strategySchema).optional(),

    investigation_action: Joi.array().items(actionSchema).optional(),
});

/* ================= UPDATE ================= */

const updateSchema = Joi.object({
    headlines: Joi.array().items(strategySchema).optional(),
    strategic_minerals: Joi.array().items(strategySchema).optional(),
    autonomy: Joi.array().items(strategySchema).optional(),
    autonomous_institutions: Joi.array().items(strategySchema).optional(),
    strategic_pillars: Joi.array().items(strategySchema).optional(),
    ambition: Joi.array().items(strategySchema).optional(),
    global_proclamation: Joi.array().items(strategySchema).optional(),

    investigation_action: Joi.array().items(actionSchema).optional(),
});

/* ================= MIDDLEWARE ================= */

exports.validateCreateInvestigateEthiopia = (req, res, next) => {
    const { error } = createSchema.validate(req.body, {
        abortEarly: true,
        allowUnknown: true,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};

exports.validateUpdateInvestigateEthiopia = (req, res, next) => {
    const { error } = updateSchema.validate(req.body, {
        abortEarly: true,
        allowUnknown: true,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};