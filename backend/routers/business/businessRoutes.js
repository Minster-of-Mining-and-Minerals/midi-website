"use strict";

const express = require("express");
const router = express.Router();

const { authenticateToken, checkPermission } = require("../../middlewares/authMiddleware");
const businessController = require("../../controllers/business/businessController");
// Assuming there might be an auth middleware to protect the routes. 
// For now, these are standard endpoints. You can add middleware later if needed.

const {
  validateUpdateOverview,
  validateCreateNode,
  validateUpdateNode,
  validateUpdatePage,
} = require("../../validators/business/businessValidator");

const importExportController = require("../../controllers/business/importExportController");

// Page routes for 5 Institutional Mineral Industry Development pages
router.get("/pages", businessController.getPages);
router.get("/pages/:slug", businessController.getPageBySlug);
router.put(
  "/pages/:slug",
  authenticateToken,
  checkPermission("businesses", "update"),
  validateUpdatePage,
  businessController.updatePage
);

// Overview routes
router.get("/overview", businessController.getOverview);
router.put(
  "/overview",
  authenticateToken,
  checkPermission("businesses", "update"),
  validateUpdateOverview,
  businessController.updateOverview
);

// Node routes
router.get("/nodes", businessController.getNodes);
router.post(
  "/nodes",
  authenticateToken,
  checkPermission("businesses", "create"),
  validateCreateNode,
  businessController.createNode
);
router.put(
  "/nodes/:id",
  authenticateToken,
  checkPermission("businesses", "update"),
  validateUpdateNode,
  businessController.updateNode
);
router.delete(
  "/nodes/:id",
  authenticateToken,
  checkPermission("businesses", "delete"),
  businessController.deleteNode
);

// Import/Export Overview routes
router.get("/import-export/overview", importExportController.getOverview);
router.put("/import-export/overview", authenticateToken, checkPermission("businesses", "update"), importExportController.updateOverview);

// Import/Export Category routes
router.get("/import-export/categories", importExportController.getCategories);
router.post("/import-export/categories", authenticateToken, checkPermission("businesses", "create"), importExportController.createCategory);
router.put("/import-export/categories/:id", authenticateToken, checkPermission("businesses", "update"), importExportController.updateCategory);
router.delete("/import-export/categories/:id", authenticateToken, checkPermission("businesses", "delete"), importExportController.deleteCategory);

// Import/Export Step routes
router.get("/import-export/steps", importExportController.getSteps);
router.post("/import-export/steps", authenticateToken, checkPermission("businesses", "create"), importExportController.createStep);
router.put("/import-export/steps/:id", authenticateToken, checkPermission("businesses", "update"), importExportController.updateStep);
router.delete("/import-export/steps/:id", authenticateToken, checkPermission("businesses", "delete"), importExportController.deleteStep);

const warehouseController = require("../../controllers/business/warehouseController");

// Warehouse routes
router.get("/warehouses/overview", warehouseController.getOverview);
router.put("/warehouses/overview", authenticateToken, checkPermission("businesses", "update"), warehouseController.updateOverview);

router.post("/warehouses/reorder", authenticateToken, checkPermission("businesses", "create"), warehouseController.reorderWarehouses);

router.get("/warehouses", warehouseController.getAllWarehouses);
router.post("/warehouses", authenticateToken, checkPermission("businesses", "create"), warehouseController.createWarehouse);
router.put("/warehouses/:id", authenticateToken, checkPermission("businesses", "update"), warehouseController.updateWarehouse);
router.delete("/warehouses/:id", authenticateToken, checkPermission("businesses", "delete"), warehouseController.deleteWarehouse);
router.post("/warehouses/:id/images", authenticateToken, checkPermission("businesses", "create"), warehouseController.addWarehouseImage);
router.delete("/warehouses/images/:imageId", authenticateToken, checkPermission("businesses", "delete"), warehouseController.deleteWarehouseImage);

const tradingController = require("../../controllers/business/tradingController");

// Trading routes
router.get("/trading/overview", tradingController.getTradingOverview);
router.put("/trading/overview", authenticateToken, checkPermission("businesses", "update"), tradingController.updateTradingOverview);

module.exports = router;
