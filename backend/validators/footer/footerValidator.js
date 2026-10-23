"use strict";
const Joi = require("joi");
const { validate: isUuid } = require("uuid");

/* ================= COMMON SCHEMA ================= */
const uuidSchema = Joi.string()
  .custom((value, helpers) => {
    if (!isUuid(value)) return helpers.error("any.invalid");
    return value;
  })
  .messages({
    "any.invalid": "Must be a valid UUID.",
  });

// A footer link: internal path ("/about"), anchor, full URL, mailto:/tel:,
// or an empty URL for a plain-text item (e.g. a value chain name)
const footerLinkSchema = Joi.object({
  label: Joi.string().max(255).required(),
  url: Joi.string()
    .allow("")
    .max(1000)
    .pattern(/^(\/|#|https?:\/\/|mailto:|tel:)/i)
    .required()
    .messages({
      "string.pattern.base":
        'Link URL must start with "/", "#", "http(s)://", "mailto:" or "tel:", or be left empty.',
    }),
});

/* ================= CREATE FOOTER ================= */
const createFooterSchema = Joi.object({
  title: Joi.string().max(255).required().messages({
    "string.empty": "Title is required.",
    "string.max": "Title cannot exceed 255 characters.",
  }),
  text: Joi.string().required().messages({
    "string.empty": "Text is required.",
  }),
  attachment_id: uuidSchema.allow(null).optional(),
  content: Joi.string().allow("", null).optional(),
  sections: Joi.array()
    .items(
      Joi.object({
        section_name: Joi.string().max(255).required(),
        links: Joi.array().items(footerLinkSchema),
      }),
    )
    .optional(),
});

/* ================= UPDATE FOOTER ================= */
const updateFooterSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  text: Joi.string().optional(),
  // null removes the logo, "" clears the content
  attachment_id: uuidSchema.allow(null).optional(),
  content: Joi.string().allow("", null).optional(),
  sections: Joi.array()
    .items(
      Joi.object({
        footer_section_id: uuidSchema.optional(),
        section_name: Joi.string().max(255).required(),
        links: Joi.array().items(footerLinkSchema),
      }),
    )
    .optional(),
});

/* ================= CREATE FOOTER SECTION ================= */
const createFooterSectionSchema = Joi.object({
  footer_id: uuidSchema.required(),
  section_name: Joi.string().max(255).required(),
  links: Joi.array().items(footerLinkSchema).optional(),
});

/* ================= MIDDLEWARES ================= */
exports.validateCreateFooter = (req, res, next) => {
  const { error } = createFooterSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  next();
};

exports.validateUpdateFooter = (req, res, next) => {
  const { error } = updateFooterSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  next();
};

exports.validateCreateFooterSection = (req, res, next) => {
  const { error } = createFooterSectionSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  next();
};
