"use strict";

const express = require("express");
const router = express.Router();

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");
const publicationPaymentController = require("../../controllers/publication/publicationPaymentController");
const {
  validateCreatePayment,
  validateVerifyPayment,
} = require("../../validators/publication/publicationPaymentValidator");

// Public or user submission of payment evidence
router.post("/", validateCreatePayment, publicationPaymentController.submitPayment);

// Admin review & verification
router.get(
  "/",
  authenticateToken,
  checkPermission("publication_payments", "read"),
  publicationPaymentController.getAllPayments
);

router.post(
  "/:id/verify",
  authenticateToken,
  checkPermission("publication_payments", "verify"),
  validateVerifyPayment,
  publicationPaymentController.verifyPayment
);

module.exports = router;
