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

const createVacancySchema = Joi.object({
  job_title: Joi.string().min(1).max(500).required().messages({
    "string.empty": "Job title is required.",
  }),
  department: Joi.string().max(255).allow("", null).optional(),
  location: Joi.string().max(255).allow("", null).optional(),
  employment_type: Joi.string()
    .valid("full_time", "contract", "part_time")
    .optional(),
  positions: Joi.number().integer().min(1).allow(null).optional(),
  description: Joi.string().allow("", null).optional(),
  requirements: Joi.string().allow("", null).optional(),
  published_date: dateSchema,
  application_deadline: dateSchema,
  attachment_id: uuidSchema.allow(null).optional(),
  status: Joi.string().valid("draft", "published", "closed").optional(),
}).custom((value, helpers) => {
  if (
    new Date(value.application_deadline) < new Date(value.published_date)
  ) {
    return helpers.error("any.invalid", {
      message: "Application deadline cannot be earlier than published date.",
    });
  }
  return value;
});

const updateVacancySchema = Joi.object({
  job_title: Joi.string().min(1).max(500).optional(),
  department: Joi.string().max(255).allow("", null).optional(),
  location: Joi.string().max(255).allow("", null).optional(),
  employment_type: Joi.string()
    .valid("full_time", "contract", "part_time")
    .optional(),
  positions: Joi.number().integer().min(1).allow(null).optional(),
  description: Joi.string().allow("", null).optional(),
  requirements: Joi.string().allow("", null).optional(),
  published_date: Joi.date().iso().optional(),
  application_deadline: Joi.date().iso().optional(),
  attachment_id: uuidSchema.allow(null).optional(),
  status: Joi.string().valid("draft", "published", "closed").optional(),
}).custom((value, helpers) => {
  if (value.published_date && value.application_deadline) {
    if (
      new Date(value.application_deadline) < new Date(value.published_date)
    ) {
      return helpers.error("any.invalid", {
        message: "Application deadline cannot be earlier than published date.",
      });
    }
  }
  return value;
});

exports.validateCreateVacancy = (req, res, next) => {
  const { error } = createVacancySchema.validate(req.body, {
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

exports.validateUpdateVacancy = (req, res, next) => {
  const { error } = updateVacancySchema.validate(req.body, {
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
