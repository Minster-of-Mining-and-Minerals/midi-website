"use strict";

const { PublicationCategory, Publication, sequelize } = require("../../models");

// GET /api/publication-categories
exports.getAllCategories = async (req, res) => {
  try {
    const { isPublic } = req.query;
    const whereClause = { deleted_at: null };

    if (isPublic === "true" || isPublic === true) {
      whereClause.is_active = true;
    }

    const categories = await PublicationCategory.findAll({
      where: whereClause,
      attributes: [
        "category_id",
        "name",
        "name_am",
        "slug",
        "description",
        "description_am",
        "image_url",
        "is_active",
        "display_order",
        "created_at",
        "updated_at",
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM publication_categories_map AS pcm
            JOIN publications AS p ON p.publication_id = pcm.publication_id
            WHERE pcm.category_id = "PublicationCategory"."category_id"
              AND p.deleted_at IS NULL
              ${isPublic ? "AND p.publish_status = 'published'" : ""}
          )`),
          "publication_count",
        ],
      ],
      order: [
        ["display_order", "ASC"],
        ["name", "ASC"],
      ],
    });

    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Get Publication Categories Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch categories." });
  }
};

// GET /api/publication-categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

    const category = await PublicationCategory.findOne({
      where: isUuid ? { category_id: id } : { slug: id },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Get Category Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch category." });
  }
};

// POST /api/publication-categories
exports.createCategory = async (req, res) => {
  try {
    const { name, name_am, slug, description, description_am, image_url, is_active, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await PublicationCategory.findOne({ where: { slug: finalSlug } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category with this slug already exists." });
    }

    const category = await PublicationCategory.create({
      name,
      name_am,
      slug: finalSlug,
      description,
      description_am,
      image_url,
      is_active: is_active !== undefined ? is_active : true,
      display_order: display_order !== undefined ? display_order : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create category." });
  }
};

// PUT /api/publication-categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await PublicationCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const { name, name_am, slug, description, description_am, image_url, is_active, display_order } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (name_am !== undefined) updateData.name_am = name_am;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (description_am !== undefined) updateData.description_am = description_am;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (display_order !== undefined) updateData.display_order = display_order;

    await category.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update category." });
  }
};

// DELETE /api/publication-categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await PublicationCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete category." });
  }
};
