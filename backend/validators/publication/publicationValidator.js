"use strict";

const Joi = require("joi");
const { validate: isUuid } = require("uuid");

const uuidValidator = (value, helpers) => {
  if (!isUuid(value)) return helpers.error("any.invalid");
  return value;
};

const createPublicationSchema = Joi.object({
  title: Joi.string().max(500).required().messages({
    "string.empty": "Title is required.",
    "string.max": "Title cannot exceed 500 characters.",
  }),
  title_am: Joi.string().max(500).allow(null, "").optional(),
  slug: Joi.string().max(500).allow(null, "").optional(),
  summary: Joi.string().allow(null, "").optional(),
  summary_am: Joi.string().allow(null, "").optional(),
  description: Joi.string().allow(null, "").optional(),
  description_am: Joi.string().allow(null, "").optional(),
  authors: Joi.string().max(500).allow(null, "").optional(),
  publication_date: Joi.date().iso().allow(null, "").optional(),
  document_type: Joi.string()
    .valid(
      "research_report",
      "mineral_map",
      "book_manual",
      "technical_publication",
      "geological_study",
      "training_material",
      "policy_strategy",
      "other"
    )
    .default("research_report"),
  language: Joi.string().max(50).default("en"),
  reference_number: Joi.string().max(100).allow(null, "").optional(),
  page_count: Joi.number().integer().min(0).allow(null).optional(),
  publish_status: Joi.string()
    .valid("draft", "pending_review", "published", "archived")
    .default("draft"),
  access_mode: Joi.string()
    .valid("open_access", "online_only", "enquiry_required", "restricted")
    .default("open_access"),
  price: Joi.number().min(0).default(0.0).optional(),
  currency: Joi.string().max(10).default("ETB").optional(),
  cover_image_id: Joi.string().custom(uuidValidator).allow(null, "").optional(),
  category_ids: Joi.array()
    .items(Joi.string().custom(uuidValidator))
    .allow(null)
    .optional(),
  files: Joi.array()
    .items(
      Joi.object({
        attachment_id: Joi.string().custom(uuidValidator).allow(null, "").optional(),
        file_role: Joi.string()
          .valid(
            "main_pdf",
            "supplementary_pdf",
            "map_document",
            "cover_image",
            "other_attachment"
          )
          .default("main_pdf"),
        title: Joi.string().max(255).allow(null, "").optional(),
        file_name: Joi.string().max(255).required(),
        file_path: Joi.string().max(500).required(),
        file_size: Joi.number().allow(null).optional(),
        mime_type: Joi.string().max(100).default("application/pdf"),
        is_public: Joi.boolean().default(false),
      })
    )
    .allow(null)
    .optional(),
});

const updatePublicationSchema = createPublicationSchema.fork(
  ["title"],
  (schema) => schema.optional()
);

exports.validateCreatePublication = (req, res, next) => {
  const { error } = createPublicationSchema.validate(req.body, {
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

exports.validateUpdatePublication = (req, res, next) => {
  const { error } = updatePublicationSchema.validate(req.body, {
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
