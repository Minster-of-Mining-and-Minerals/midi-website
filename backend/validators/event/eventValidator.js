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

/* ================= CREATE EVENT ================= */

const createEventSchema = Joi.object({
  title: Joi.string().min(5).required(),

  description: Joi.string().allow("", null).optional(),

  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().greater(Joi.ref("start_time")).required(),

  location: Joi.string().optional(),
  virtual_link: Joi.string().uri().optional(),

  organizer: Joi.string().required(),

  content: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),

  attachments: Joi.array().items(uuidSchema).optional().default([]),
  event_category_id: uuidSchema.optional().allow(null),

  publish_start: Joi.date().iso().optional(),
  publish_end: Joi.date().iso().greater(Joi.ref("publish_start")).optional(),

  status: Joi.string()
    .valid(
      "draft",
      "scheduled",
      "published",
      "ongoing",
      "completed",
      "archived",
      "cancelled",
    )
    .optional(),
});

/* ================= UPDATE EVENT ================= */

const updateEventSchema = Joi.object({
  title: Joi.string().min(5).optional(),

  description: Joi.string().allow("", null).optional(),

  start_time: Joi.date().iso().optional(),
  end_time: Joi.date().iso().optional(),

  location: Joi.string().optional(),
  virtual_link: Joi.string().uri().optional(),

  organizer: Joi.string().optional(),

  content: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),

  attachment_ids: Joi.array().items(uuidSchema).optional(),
  attachments: Joi.array().items(uuidSchema).optional(),
  event_category_id: uuidSchema.optional().allow(null),

  publish_start: Joi.date().iso().optional(),
  publish_end: Joi.date().iso().optional(),

  status: Joi.string()
    .valid(
      "draft",
      "scheduled",
      "published",
      "ongoing",
      "completed",
      "archived",
      "cancelled",
    )
    .optional(),
});

/* ================= MIDDLEWARE ================= */

exports.validateCreateEvent = (req, res, next) => {
  const { error } = createEventSchema.validate(req.body, {
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

exports.validateUpdateEvent = (req, res, next) => {
  const { error } = updateEventSchema.validate(req.body, {
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
