"use strict";

const Joi = require("joi");
const { validate: isUuid } = require("uuid");

const uuidValidator = (value, helpers) => {
  if (!isUuid(value)) return helpers.error("any.invalid");
  return value;
};

const createPublicationInquirySchema = Joi.object({
  publication_id: Joi.string().custom(uuidValidator).required().messages({
    "any.invalid": "Must be a valid UUID for publication_id.",
    "any.required": "publication_id is required.",
  }),

  inquiry_type: Joi.string()
    .valid(
      "general_inquiry",
      "document_request",
      "access_request",
      "paid_publication_request"
    )
    .default("general_inquiry"),

  name: Joi.string().max(255).required().messages({
    "string.empty": "Name is required.",
    "string.max": "Name cannot exceed 255 characters.",
  }),

  company: Joi.string().max(255).allow(null, "").optional().messages({
    "string.max": "Company cannot exceed 255 characters.",
  }),

  email: Joi.string().email().max(255).required().messages({
    "string.empty": "Email is required.",
    "string.email": "Must be a valid email address.",
    "string.max": "Email cannot exceed 255 characters.",
  }),

  phone: Joi.string().max(100).allow(null, "").optional().messages({
    "string.max": "Phone number cannot exceed 100 characters.",
  }),

  message: Joi.string().max(10000).required().messages({
    "string.empty": "Message is required.",
    "string.max": "Message cannot exceed 10000 characters.",
  }),
});

exports.validatePublicationInquiry = (req, res, next) => {
  const { error } = createPublicationInquirySchema.validate(req.body, {
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
