"use strict";

const Joi = require("joi");
const { validate: isUuid } = require("uuid");

const uuidValidator = (value, helpers) => {
  if (value && !isUuid(value)) return helpers.error("any.invalid");
  return value;
};

const updateOverviewSchema = Joi.object({
  title_part1: Joi.string().max(255).allow(null, "").optional(),
  title_part1_am: Joi.string().max(255).allow(null, "").optional(),
  title_part2: Joi.string().max(255).allow(null, "").optional(),
  title_part2_am: Joi.string().max(255).allow(null, "").optional(),
  description1: Joi.string().allow(null, "").optional(),
  description1_am: Joi.string().allow(null, "").optional(),
  description2: Joi.string().allow(null, "").optional(),
  description2_am: Joi.string().allow(null, "").optional(),
  business_data: Joi.any().allow(null).optional(),
  business_categories: Joi.any().allow(null).optional(),
  key_metrics: Joi.any().allow(null).optional(),
  operations_data: Joi.any().allow(null).optional(),
  quick_stats: Joi.any().allow(null).optional(),
  network_operations: Joi.any().allow(null).optional(),
  page_metadata: Joi.any().allow(null).optional(),
});

const createNodeSchema = Joi.object({
  id_string: Joi.string().max(100).required().messages({
    "string.empty": "Node identifier (id_string) is required.",
    "any.required": "Node identifier (id_string) is required.",
  }),
  title: Joi.string().max(255).required().messages({
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),
  title_am: Joi.string().max(255).allow(null, "").optional(),
  description: Joi.string().allow(null, "").optional(),
  description_am: Joi.string().allow(null, "").optional(),
  icon: Joi.string().max(100).allow(null, "").optional(),
  position_x: Joi.number().integer().min(0).max(100).default(50).optional(),
  position_y: Joi.number().integer().min(0).max(100).default(50).optional(),
  mobile_order: Joi.number().integer().min(0).default(1).optional(),
});

const updateNodeSchema = createNodeSchema.fork(
  ["id_string", "title"],
  (schema) => schema.optional()
);

const updatePageSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  title_am: Joi.string().max(255).allow(null, "").optional(),
  subtitle: Joi.string().max(255).allow(null, "").optional(),
  subtitle_am: Joi.string().max(255).allow(null, "").optional(),
  summary: Joi.string().allow(null, "").optional(),
  summary_am: Joi.string().allow(null, "").optional(),
  content: Joi.string().allow(null, "").optional(),
  content_am: Joi.string().allow(null, "").optional(),
  cover_image_id: Joi.string().custom(uuidValidator).allow(null, "").optional(),
  sections_data: Joi.any().allow(null).optional(),
  publish_status: Joi.string().valid("published", "draft", "archived").optional(),
  display_order: Joi.number().integer().min(0).optional(),
});

exports.validateUpdateOverview = (req, res, next) => {
  const { error } = updateOverviewSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  next();
};

exports.validateCreateNode = (req, res, next) => {
  const { error } = createNodeSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  next();
};

exports.validateUpdateNode = (req, res, next) => {
  const { error } = updateNodeSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  next();
};

exports.validateUpdatePage = (req, res, next) => {
  const { error } = updatePageSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  next();
};
