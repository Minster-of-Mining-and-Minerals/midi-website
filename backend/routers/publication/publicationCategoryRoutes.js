"use strict";

const express = require("express");
const router = express.Router();

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");
const publicationCategoryController = require("../../controllers/publication/publicationCategoryController");

router.get("/", publicationCategoryController.getAllCategories);
router.get("/:id", publicationCategoryController.getCategoryById);

router.post(
  "/",
  authenticateToken,
  checkPermission("publication_categories", "create"),
  publicationCategoryController.createCategory
);

router.put(
  "/:id",
  authenticateToken,
  checkPermission("publication_categories", "update"),
  publicationCategoryController.updateCategory
);

router.delete(
  "/:id",
  authenticateToken,
  checkPermission("publication_categories", "delete"),
  publicationCategoryController.deleteCategory
);

module.exports = router;
