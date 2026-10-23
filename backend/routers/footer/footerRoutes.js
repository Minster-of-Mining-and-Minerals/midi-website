"use strict";
const express = require("express");
const router = express.Router();
const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");

const {
  createFooter,
  getAllFooters,
  getFooterById,
  updateFooter,
  deleteFooter,
} = require("../../controllers/footer/footerController");

const {
  createFooterSection,
  getSectionsByFooterId,
} = require("../../controllers/footer/footerSectionController");

const {
  validateCreateFooter,
  validateUpdateFooter,
  validateCreateFooterSection,
} = require("../../validators/footer/footerValidator");

// ================= FOOTER CRUD =================
// footer:update is the only write permission seeded for the footer
router.post("/", authenticateToken, checkPermission("footer", "update"), validateCreateFooter, createFooter);
router.get("/", getAllFooters);
router.get("/:id", getFooterById);
router.put("/:id", authenticateToken, checkPermission("footer", "update"), validateUpdateFooter, updateFooter);
router.delete("/:id", authenticateToken, checkPermission("footer", "update"), deleteFooter);

// ================= FOOTER SECTION =================
router.post(
  "/section",
  authenticateToken,
  checkPermission("footer", "update"),
  validateCreateFooterSection,
  createFooterSection,
);
router.get("/section/:footer_id", getSectionsByFooterId);

module.exports = router;
