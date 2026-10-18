"use strict";

const Joi = require("joi");
const { validate: isUuid } = require("uuid");

const uuidValidator = (value, helpers) => {
  if (!isUuid(value)) return helpers.error("any.invalid");
  return value;
};

const createPublicationPaymentSchema = Joi.object({
  inquiry_id: Joi.string().custom(uuidValidator).required().messages({
    "any.invalid": "Must be a valid UUID for inquiry_id.",
    "any.required": "inquiry_id is required.",
  }),

  publication_id: Joi.string().custom(uuidValidator).required().messages({
    "any.invalid": "Must be a valid UUID for publication_id.",
    "any.required": "publication_id is required.",
  }),

  amount: Joi.number().positive().required().messages({
    "any.required": "Payment amount is required.",
  }),

  currency: Joi.string().max(10).default("ETB").optional(),

  payment_method: Joi.string()
    .valid("bank_transfer", "telebirr_manual", "cbe_birr", "other")
    .default("bank_transfer"),

  transaction_reference: Joi.string().max(255).allow(null, "").optional(),

  slip_attachment_id: Joi.string().custom(uuidValidator).allow(null, "").optional(),

  admin_notes: Joi.string().allow(null, "").optional(),
});

const verifyPaymentSchema = Joi.object({
  status: Joi.string().valid("verified", "rejected").required(),
  rejection_reason: Joi.string().allow(null, "").optional(),
  admin_notes: Joi.string().allow(null, "").optional(),
  grant_access: Joi.boolean().default(true).optional(),
  access_level: Joi.string().valid("online_only", "download_allowed").default("download_allowed").optional(),
  expires_in_days: Joi.number().integer().min(1).max(365).allow(null).optional(),
});

exports.validateCreatePayment = (req, res, next) => {
  const { error } = createPublicationPaymentSchema.validate(req.body, {
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

exports.validateVerifyPayment = (req, res, next) => {
  const { error } = verifyPaymentSchema.validate(req.body, {
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
