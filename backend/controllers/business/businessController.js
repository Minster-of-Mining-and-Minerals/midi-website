"use strict";
const { BusinessOverview, BusinessNode, BusinessPage } = require("../../models");

const businessController = {
  // --- Pages ---
  async getPages(req, res) {
    try {
      const { status } = req.query;
      const where = {};
      if (status && status !== "all") {
        where.publish_status = status;
      } else if (!status) {
        where.publish_status = "published";
      }
      const pages = await BusinessPage.findAll({
        where,
        order: [["display_order", "ASC"]],
      });
      return res.status(200).json(pages);
    } catch (error) {
      console.error("Error fetching Business Pages:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async getPageBySlug(req, res) {
    try {
      const { slug } = req.params;
      const page = await BusinessPage.findOne({
        where: { slug },
      });
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      return res.status(200).json(page);
    } catch (error) {
      console.error("Error fetching Business Page by slug:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async updatePage(req, res) {
    try {
      const { slug } = req.params;
      const {
        title,
        title_am,
        subtitle,
        subtitle_am,
        summary,
        summary_am,
        content,
        content_am,
        cover_image_id,
        sections_data,
        publish_status,
        display_order,
      } = req.body;

      let page = await BusinessPage.findOne({ where: { slug } });
      if (!page) {
        // If not found by slug, create new page entry
        page = await BusinessPage.create({
          slug,
          title,
          title_am,
          subtitle,
          subtitle_am,
          summary,
          summary_am,
          content,
          content_am,
          cover_image_id,
          sections_data,
          publish_status: publish_status || "published",
          display_order: display_order || 1,
        });
      } else {
        await page.update({
          title,
          title_am,
          subtitle,
          subtitle_am,
          summary,
          summary_am,
          content,
          content_am,
          cover_image_id,
          sections_data,
          publish_status,
          display_order,
        });
      }

      return res.status(200).json({ message: "Page updated successfully", page });
    } catch (error) {
      console.error("Error updating Business Page:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // --- Overview ---
  async getOverview(req, res) {
    try {
      const overview = await BusinessOverview.findOne();
      if (!overview) {
        // Return clean empty structure without creating records in database (safe GET)
        return res.status(200).json(null);
      }
      return res.status(200).json(overview);
    } catch (error) {
      console.error("Error fetching Business Overview:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async updateOverview(req, res) {
    try {
      const {
        title_part1,
        title_part1_am,
        title_part2,
        title_part2_am,
        description1,
        description1_am,
        description2,
        description2_am,
        business_data,
        business_categories,
        key_metrics,
        operations_data,
        quick_stats,
        network_operations,
        page_metadata,
      } = req.body;

      const sanitizedData = {
        title_part1,
        title_part1_am,
        title_part2,
        title_part2_am,
        description1,
        description1_am,
        description2,
        description2_am,
        business_data,
        business_categories,
        key_metrics,
        operations_data,
        quick_stats,
        network_operations,
        page_metadata,
      };

      let overview = await BusinessOverview.findOne();

      if (!overview) {
        overview = await BusinessOverview.create(sanitizedData);
      } else {
        await overview.update(sanitizedData);
      }
      return res.status(200).json({ message: "Overview updated successfully", overview });
    } catch (error) {
      console.error("Error updating Business Overview:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // --- Nodes ---
  async getNodes(req, res) {
    try {
      const nodes = await BusinessNode.findAll({
        order: [["mobile_order", "ASC"]],
      });
      return res.status(200).json(nodes);
    } catch (error) {
      console.error("Error fetching Business Nodes:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async createNode(req, res) {
    try {
      const {
        id_string,
        title,
        title_am,
        description,
        description_am,
        icon,
        position_x,
        position_y,
        mobile_order,
      } = req.body;

      const node = await BusinessNode.create({
        id_string,
        title,
        title_am,
        description,
        description_am,
        icon,
        position_x,
        position_y,
        mobile_order,
      });
      return res.status(201).json({ message: "Node created successfully", node });
    } catch (error) {
      console.error("Error creating Business Node:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async updateNode(req, res) {
    try {
      const { id } = req.params;
      const {
        id_string,
        title,
        title_am,
        description,
        description_am,
        icon,
        position_x,
        position_y,
        mobile_order,
      } = req.body;

      const node = await BusinessNode.findByPk(id);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }

      await node.update({
        id_string,
        title,
        title_am,
        description,
        description_am,
        icon,
        position_x,
        position_y,
        mobile_order,
      });
      return res.status(200).json({ message: "Node updated successfully", node });
    } catch (error) {
      console.error("Error updating Business Node:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async deleteNode(req, res) {
    try {
      const { id } = req.params;
      const node = await BusinessNode.findByPk(id);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }
      await node.destroy();
      return res.status(200).json({ message: "Node deleted successfully" });
    } catch (error) {
      console.error("Error deleting Business Node:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = businessController;
