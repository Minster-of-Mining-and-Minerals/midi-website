"use strict";

const express = require("express");
const router = express.Router();

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");
const { publicationInquiryLimiter } = require("../../middlewares/rateLimitMiddleware");
const publicationInquiryController = require("../../controllers/publication/publicationInquiryController");
const {
  validatePublicationInquiry,
} = require("../../validators/publication/publicationInquiryValidator");

// Public inquiry submission (rate limited & validated)
router.post(
  "/",
  publicationInquiryLimiter,
  validatePublicationInquiry,
  publicationInquiryController.submitInquiry
);

// Protected Admin Inquiry Endpoints
router.get(
  "/",
  authenticateToken,
  checkPermission("publication_inquiries", "read"),
  publicationInquiryController.getAllInquiries
);

router.get(
  "/:id",
  authenticateToken,
  checkPermission("publication_inquiries", "read"),
  publicationInquiryController.getInquiryById
);

router.put(
  "/:id/status",
  authenticateToken,
  checkPermission("publication_inquiries", "update"),
  publicationInquiryController.updateInquiryStatus
);

router.post(
  "/:id/reply",
  authenticateToken,
  checkPermission("publication_inquiries", "reply"),
  publicationInquiryController.replyToInquiry
);

router.delete(
  "/:id",
  authenticateToken,
  checkPermission("publication_inquiries", "delete"),
  publicationInquiryController.deleteInquiry
);

module.exports = router;
