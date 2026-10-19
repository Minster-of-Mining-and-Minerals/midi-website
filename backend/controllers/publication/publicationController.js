"use strict";

const {
  Publication,
  PublicationCategory,
  PublicationFile,
  Attachment,
  User,
  sequelize,
} = require("../../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const checkAdminAuth = async (req) => {
  const authHeader = req.headers["x-authorization"] || req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.user_id, {
      attributes: ["user_id", "is_active"],
      include: [
        {
          model: sequelize.models.Role,
          as: "roles",
          include: [
            {
              model: sequelize.models.RolePermission,
              as: "rolePermissions",
              include: [
                {
                  model: sequelize.models.Permission,
                  as: "permission",
                  attributes: ["resource", "action"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user || !user.is_active) return false;

    const flattened = user.roles.flatMap((r) =>
      r.rolePermissions.map((rp) => `${rp.permission?.resource}:${rp.permission?.action}`)
    );

    return flattened.includes("publications:read");
  } catch (e) {
    return false;
  }
};

const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 7)
  );
};

// GET /api/publications
exports.getAllPublications = async (req, res) => {
  try {
    const {
      category,
      search,
      document_type,
      access_mode,
      language,
      publish_status,
      page,
      limit,
      sort_by = "publication_date",
      sort_order = "DESC",
    } = req.query;

    const isAdmin = await checkAdminAuth(req);

    const whereClause = { deleted_at: null };

    // Enforce publication visibility
    if (isAdmin) {
      if (publish_status && publish_status !== "all") {
        whereClause.publish_status = publish_status;
      }
    } else {
      whereClause.publish_status = "published";
    }

    if (document_type && document_type !== "all") {
      whereClause.document_type = document_type;
    }

    if (access_mode && access_mode !== "all") {
      whereClause.access_mode = access_mode;
    }

    if (language && language !== "all") {
      whereClause.language = language;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { title_am: { [Op.iLike]: `%${search}%` } },
        { summary: { [Op.iLike]: `%${search}%` } },
        { authors: { [Op.iLike]: `%${search}%` } },
        { reference_number: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const includeCategories = {
      model: PublicationCategory,
      as: "categories",
      attributes: ["category_id", "name", "name_am", "slug"],
    };

    if (category && category !== "all") {
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        category
      );
      if (isUuid) {
        includeCategories.where = { category_id: category };
      } else {
        includeCategories.where = { slug: category };
      }
    }

    const validSortFields = [
      "created_at",
      "publication_date",
      "title",
      "views_count",
      "downloads_count",
    ];
    const orderField = validSortFields.includes(sort_by) ? sort_by : "publication_date";
    const orderDirection = sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const queryOptions = {
      where: whereClause,
      include: [
        includeCategories,
        {
          model: PublicationFile,
          as: "files",
          attributes: [
            "publication_file_id",
            "file_role",
            "title",
            "file_name",
            "file_size",
            "mime_type",
            "is_public",
          ],
        },
        {
          model: Attachment,
          as: "coverImage",
          attributes: ["attachment_id", "file_name", "file_path", "file_path_thumb", "file_path_medium"],
        },
      ],
      order: [[orderField, orderDirection]],
      distinct: true,
    };

    if (page && limit) {
      const pageNumber = Math.max(1, parseInt(page, 10) || 1);
      const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
      const offset = (pageNumber - 1) * limitNumber;

      queryOptions.limit = limitNumber;
      queryOptions.offset = offset;

      const { count, rows } = await Publication.findAndCountAll(queryOptions);

      return res.status(200).json({
        success: true,
        data: rows,
        meta: {
          total: count,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(count / limitNumber),
        },
      });
    }

    const publications = await Publication.findAll(queryOptions);
    return res.status(200).json({ success: true, data: publications });
  } catch (error) {
    console.error("Get Publications Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch publications." });
  }
};

// GET /api/publications/:identifier (slug or id)
exports.getPublication = async (req, res) => {
  try {
    const { identifier } = req.params;
    const isAdmin = await checkAdminAuth(req);

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      identifier
    );
    const whereClause = { deleted_at: null };

    if (isUuid) {
      whereClause.publication_id = identifier;
    } else {
      whereClause.slug = identifier;
    }

    if (!isAdmin) {
      whereClause.publish_status = "published";
    }

    const publication = await Publication.findOne({
      where: whereClause,
      include: [
        {
          model: PublicationCategory,
          as: "categories",
          attributes: ["category_id", "name", "name_am", "slug", "description"],
        },
        {
          model: PublicationFile,
          as: "files",
          attributes: [
            "publication_file_id",
            "file_role",
            "title",
            "file_name",
            "file_size",
            "mime_type",
            "is_public",
            // Admins need the storage path to re-submit files when editing
            ...(isAdmin ? ["file_path"] : []),
          ],
        },
        {
          model: Attachment,
          as: "coverImage",
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "full_name", "email"],
        },
      ],
    });

    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found." });
    }

    return res.status(200).json({ success: true, data: publication });
  } catch (error) {
    console.error("Get Publication Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch publication details." });
  }
};

// POST /api/publications
exports.createPublication = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      title,
      title_am,
      slug,
      summary,
      summary_am,
      description,
      description_am,
      authors,
      publication_date,
      document_type,
      language,
      reference_number,
      page_count,
      publish_status = "draft",
      access_mode = "open_access",
      price = 0.0,
      currency = "ETB",
      cover_image_id,
      category_ids,
      files,
    } = req.body;

    let finalSlug = slug ? slug.trim() : generateSlug(title);

    // Verify slug uniqueness
    const existing = await Publication.findOne({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newPublication = await Publication.create(
      {
        title,
        title_am,
        slug: finalSlug,
        summary,
        summary_am,
        description,
        description_am,
        authors,
        publication_date: publication_date || new Date(),
        document_type: document_type || "research_report",
        language: language || "en",
        reference_number,
        page_count,
        publish_status,
        access_mode,
        price,
        currency,
        cover_image_id: cover_image_id || null,
        created_by: req.user?.user_id || null,
        published_at: publish_status === "published" ? new Date() : null,
      },
      { transaction: t }
    );

    // Associate categories
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      await newPublication.setCategories(category_ids, { transaction: t });
    }

    // Associate files
    if (files && Array.isArray(files) && files.length > 0) {
      const fileRecords = files.map((f) => ({
        publication_id: newPublication.publication_id,
        attachment_id: f.attachment_id || null,
        file_role: f.file_role || "main_pdf",
        title: f.title || f.file_name,
        file_name: f.file_name,
        file_path: f.file_path,
        file_size: f.file_size || null,
        mime_type: f.mime_type || "application/pdf",
        is_public: access_mode === "open_access",
      }));

      await PublicationFile.bulkCreate(fileRecords, { transaction: t });
    }

    await t.commit();

    const created = await Publication.findByPk(newPublication.publication_id, {
      include: [
        { model: PublicationCategory, as: "categories" },
        { model: PublicationFile, as: "files" },
        { model: Attachment, as: "coverImage" },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Publication created successfully.",
      data: created,
    });
  } catch (error) {
    await t.rollback();
    console.error("Create Publication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create publication.",
      error: error.message,
    });
  }
};

// PUT /api/publications/:id
exports.updatePublication = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Publication not found." });
    }

    const {
      title,
      title_am,
      slug,
      summary,
      summary_am,
      description,
      description_am,
      authors,
      publication_date,
      document_type,
      language,
      reference_number,
      page_count,
      publish_status,
      access_mode,
      price,
      currency,
      cover_image_id,
      category_ids,
      files,
    } = req.body;

    const updateData = {
      updated_by: req.user?.user_id || null,
      updated_at: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (title_am !== undefined) updateData.title_am = title_am;
    if (slug !== undefined) updateData.slug = slug;
    if (summary !== undefined) updateData.summary = summary;
    if (summary_am !== undefined) updateData.summary_am = summary_am;
    if (description !== undefined) updateData.description = description;
    if (description_am !== undefined) updateData.description_am = description_am;
    if (authors !== undefined) updateData.authors = authors;
    if (publication_date !== undefined) updateData.publication_date = publication_date;
    if (document_type !== undefined) updateData.document_type = document_type;
    if (language !== undefined) updateData.language = language;
    if (reference_number !== undefined) updateData.reference_number = reference_number;
    if (page_count !== undefined) updateData.page_count = page_count;
    if (access_mode !== undefined) updateData.access_mode = access_mode;
    if (price !== undefined) updateData.price = price;
    if (currency !== undefined) updateData.currency = currency;
    if (cover_image_id !== undefined) updateData.cover_image_id = cover_image_id;

    if (publish_status !== undefined) {
      updateData.publish_status = publish_status;
      if (publish_status === "published" && !publication.published_at) {
        updateData.published_at = new Date();
      }
    }

    await publication.update(updateData, { transaction: t });

    // Sync categories if provided
    if (category_ids !== undefined) {
      await publication.setCategories(category_ids || [], { transaction: t });
    }

    // Sync files if provided
    if (files && Array.isArray(files)) {
      await PublicationFile.destroy({
        where: { publication_id: publication.publication_id },
        transaction: t,
      });

      if (files.length > 0) {
        const fileRecords = files.map((f) => ({
          publication_id: publication.publication_id,
          attachment_id: f.attachment_id || null,
          file_role: f.file_role || "main_pdf",
          title: f.title || f.file_name,
          file_name: f.file_name,
          file_path: f.file_path,
          file_size: f.file_size || null,
          mime_type: f.mime_type || "application/pdf",
          is_public: (updateData.access_mode || publication.access_mode) === "open_access",
        }));

        await PublicationFile.bulkCreate(fileRecords, { transaction: t });
      }
    }

    await t.commit();

    const updated = await Publication.findByPk(id, {
      include: [
        { model: PublicationCategory, as: "categories" },
        { model: PublicationFile, as: "files" },
        { model: Attachment, as: "coverImage" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Publication updated successfully.",
      data: updated,
    });
  } catch (error) {
    await t.rollback();
    console.error("Update Publication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update publication.",
      error: error.message,
    });
  }
};

// DELETE /api/publications/:id
exports.deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found." });
    }

    await publication.destroy();

    return res.status(200).json({
      success: true,
      message: "Publication deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Publication Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete publication." });
  }
};

// PATCH /api/publications/:id/publish
exports.publishPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({ success: false, message: "Publication not found." });
    }

    await publication.update({
      publish_status: "published",
      published_at: new Date(),
      updated_by: req.user?.user_id,
      updated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Publication published successfully.",
      data: publication,
    });
  } catch (error) {
    console.error("Publish Publication Error:", error);
    return res.status(500).json({ success: false, message: "Failed to publish publication." });
  }
};
