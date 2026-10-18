"use strict";
const Joi = require("joi");

// =================== Core Value Schema ===================
const coreValueSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  content: Joi.string().optional(),
});

// =================== Section Schema ===================
const sectionSchema = Joi.object({
  type: Joi.string().valid("mission", "vision", "core_values").required(),
  title: Joi.string().min(2).max(255).required(),
  attachment_id: Joi.string().guid({ version: "uuidv4" }).required(), // required UUID
  content: Joi.string().optional(),
  core_values: Joi.when("type", {
    is: "core_values",
    then: Joi.array().items(coreValueSchema).required(),
    otherwise: Joi.forbidden(),
  }),
});

// =================== Create Strategy Schema ===================
const createStrategySchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow("", null).optional(),
  sections: Joi.array().items(sectionSchema).optional(),
});

// =================== Update Strategy Schema ===================
const updateStrategySchema = Joi.object({
  title: Joi.string().min(2).max(255).optional(),
  description: Joi.string().allow("", null).optional(),
  sections: Joi.array().items(sectionSchema).optional(),
});

// =================== Middleware ===================
exports.validateCreateStrategy = (req, res, next) => {
  const { error } = createStrategySchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

exports.validateUpdateStrategy = (req, res, next) => {
  const { error } = updateStrategySchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};
