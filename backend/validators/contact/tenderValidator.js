"use strict";

const Joi = require("joi");
const { validate: isUuid } = require("uuid");

const uuidSchema = Joi.string().custom((value, helpers) => {
  if (!isUuid(value)) return helpers.error("any.invalid");
  return value;
}).messages({ "any.invalid": "Must be a valid UUID." });

const dateSchema = Joi.date().iso().required().messages({
  "any.required": "Date is required.",
  "date.base": "Must be a valid date.",
});

const createTenderSchema = Joi.object({
  title: Joi.string().min(1).max(500).required().messages({
    "string.empty": "Title is required.",
  }),
  reference_number: Joi.string().max(100).allow("", null).optional(),
  description: Joi.string().allow("", null).optional(),
  published_date: dateSchema,
  closing_date: dateSchema,
  attachment_id: uuidSchema.allow(null).optional(),
  status: Joi.string().valid("draft", "published", "closed").optional(),
}).custom((value, helpers) => {
  if (new Date(value.closing_date) < new Date(value.published_date)) {
    return helpers.error("any.invalid", {
      message: "Closing date cannot be earlier than published date.",
    });
  }
  return value;
});

const updateTenderSchema = Joi.object({
  title: Joi.string().min(1).max(500).optional(),
  reference_number: Joi.string().max(100).allow("", null).optional(),
  description: Joi.string().allow("", null).optional(),
  published_date: Joi.date().iso().optional(),
  closing_date: Joi.date().iso().optional(),
  attachment_id: uuidSchema.allow(null).optional(),
  status: Joi.string().valid("draft", "published", "closed").optional(),
}).custom((value, helpers) => {
  if (value.published_date && value.closing_date) {
    if (new Date(value.closing_date) < new Date(value.published_date)) {
      return helpers.error("any.invalid", {
        message: "Closing date cannot be earlier than published date.",
      });
    }
  }
  return value;
});

exports.validateCreateTender = (req, res, next) => {
  const { error } = createTenderSchema.validate(req.body, {
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

exports.validateUpdateTender = (req, res, next) => {
  const { error } = updateTenderSchema.validate(req.body, {
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
