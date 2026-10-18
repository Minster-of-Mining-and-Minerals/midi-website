"use strict";

const express = require("express");
const router = express.Router();

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/uploadMiddleware");
const publicationController = require("../../controllers/publication/publicationController");
const publicationDocumentController = require("../../controllers/publication/publicationDocumentController");
const {
  validateCreatePublication,
  validateUpdatePublication,
} = require("../../validators/publication/publicationValidator");

// Public browsing & details
router.get("/", publicationController.getAllPublications);

// Secure document viewing & streaming (HTTP Range support)
router.get("/:id/view", publicationDocumentController.viewDocument);
router.get("/:id/files/:fileId/view", publicationDocumentController.viewDocument);

// Secure document downloading
router.get("/:id/download", publicationDocumentController.downloadDocument);
router.get("/:id/files/:fileId/download", publicationDocumentController.downloadDocument);

// Single publication details by slug or id
router.get("/:identifier", publicationController.getPublication);

// Protected PDF / Map Upload
router.post(
  "/upload-document",
  authenticateToken,
  checkPermission("publications", "create"),
  upload.single("file"),
  publicationDocumentController.uploadProtectedDocument
);

// Admin CRUD
router.post(
  "/",
  authenticateToken,
  checkPermission("publications", "create"),
  validateCreatePublication,
  publicationController.createPublication
);

router.put(
  "/:id",
  authenticateToken,
  checkPermission("publications", "update"),
  validateUpdatePublication,
  publicationController.updatePublication
);

router.delete(
  "/:id",
  authenticateToken,
  checkPermission("publications", "delete"),
  publicationController.deletePublication
);

router.patch(
  "/:id/publish",
  authenticateToken,
  checkPermission("publications", "publish"),
  publicationController.publishPublication
);

module.exports = router;
