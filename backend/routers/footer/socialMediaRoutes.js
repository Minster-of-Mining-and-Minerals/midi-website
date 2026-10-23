"use strict";
const express = require("express");
const router = express.Router();
const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");

const {
  createSocialMedia,
  getAllSocialMedias,
  getSocialMediaById,
  updateSocialMedia,
  deleteSocialMedia,
} = require("../../controllers/footer/socialMediaController");

const {
  validateCreateSocialMedia,
  validateUpdateSocialMedia,
} = require("../../validators/footer/socialMediaValidator");

// ================= SOCIAL MEDIA CRUD =================
// Social links are managed from the footer admin, so they use the footer permission
router.post(
  "/",
  authenticateToken,
  checkPermission("footer", "update"),
  validateCreateSocialMedia,
  createSocialMedia,
);
router.get("/", getAllSocialMedias);
router.get("/:id", getSocialMediaById);
router.put(
  "/:id",
  authenticateToken,
  checkPermission("footer", "update"),
  validateUpdateSocialMedia,
  updateSocialMedia,
);
router.delete("/:id", authenticateToken, checkPermission("footer", "update"), deleteSocialMedia);

module.exports = router;
