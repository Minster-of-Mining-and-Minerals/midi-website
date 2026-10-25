"use strict";
const express = require("express");
const router = express.Router();
const {
    createCertification,
    getAllCertifications,
    getCertificationById,
    updateCertification,
    deleteCertification,
} = require("../../controllers/about/certificationController");

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");

// Public Routes
router.get("/", getAllCertifications);
router.get("/:id", getCertificationById);

// Protected Routes
router.use(authenticateToken);
router.post("/", checkPermission("about", "update"), createCertification);
router.put("/:id", checkPermission("about", "update"), updateCertification);
router.delete("/:id", checkPermission("about", "delete"), deleteCertification);

module.exports = router;
