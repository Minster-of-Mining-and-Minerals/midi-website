"use strict";
const Joi = require("joi");

// =================== Core Value Schema ===================
const coreValueSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  content: Joi.string().allow("", null).optional(),
  title_am: Joi.string().allow("", null).max(255).optional(),
  content_am: Joi.string().allow("", null).optional(),
});

// =================== Section Schema ===================
const sectionSchema = Joi.object({
  type: Joi.string().valid("mission", "vision", "core_values").required(),
  title: Joi.string().min(2).max(255).required(),
  // Optional: sections without an icon use the public page's fallback icon
  attachment_id: Joi.string().guid({ version: "uuidv4" }).allow(null).optional(),
  content: Joi.string().allow("", null).optional(),
  content_am: Joi.string().allow("", null).optional(),
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
  title_am: Joi.string().allow("", null).max(255).optional(),
  description_am: Joi.string().allow("", null).optional(),
  sections: Joi.array().items(sectionSchema).optional(),
});

// =================== Update Strategy Schema ===================
const updateStrategySchema = Joi.object({
  title: Joi.string().min(2).max(255).optional(),
  description: Joi.string().allow("", null).optional(),
  title_am: Joi.string().allow("", null).max(255).optional(),
  description_am: Joi.string().allow("", null).optional(),
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
