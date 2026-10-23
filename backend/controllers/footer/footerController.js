"use strict";

const { Footer, FooterSection, Attachment, sequelize } = require("../../models");
const { v4: uuidv4, validate: isUuid } = require("uuid");

// ===========================
// CREATE FOOTER
// ===========================
const createFooter = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { title, text, attachment_id, content, sections } = req.body;

    if (!title || !text) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Title and text are required." });
    }

    // Create Footer
    const footer = await Footer.create(
      {
        footer_id: uuidv4(),
        title,
        text,
        attachment_id: attachment_id || null,
        content: content || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t },
    );

    // Create FooterSections if provided
    if (sections && Array.isArray(sections)) {
      for (const section of sections) {
        await FooterSection.create(
          {
            footer_section_id: uuidv4(),
            footer_id: footer.footer_id,
            section_name: section.section_name || "Untitled Section",
            links: section.links || [],
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Footer created successfully",
      data: footer,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Create Footer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create footer",
      error: error.message,
    });
  }
};

// ===========================
// GET ALL FOOTERS
// ===========================
const getAllFooters = async (req, res) => {
  try {
    const footers = await Footer.findAll({
      include: [
        { model: FooterSection, as: "sections" },
        { model: Attachment, as: "attachment" },
      ],
      // Newest footer first; its sections in creation order so columns keep their position
      order: [
        ["created_at", "DESC"],
        [{ model: FooterSection, as: "sections" }, "created_at", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Footers fetched successfully",
      count: footers.length,
      data: footers,
    });
  } catch (error) {
    console.error("Fetch Footers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch footers",
      error: error.message,
    });
  }
};

// ===========================
// GET FOOTER BY ID
// ===========================
const getFooterById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid footer ID." });

    const footer = await Footer.findByPk(id, {
      include: [
        { model: FooterSection, as: "sections" },
        { model: Attachment, as: "attachment" },
      ],
      order: [[{ model: FooterSection, as: "sections" }, "created_at", "ASC"]],
    });

    if (!footer)
      return res
        .status(404)
        .json({ success: false, message: "Footer not found." });

    return res.status(200).json({
      success: true,
      message: "Footer fetched successfully",
      data: footer,
    });
  } catch (error) {
    console.error("Get Footer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer",
      error: error.message,
    });
  }
};

// ===========================
// UPDATE FOOTER
// ===========================
const updateFooter = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { title, text, attachment_id, content, sections } = req.body;

    const footer = await Footer.findByPk(id, { transaction: t });
    if (!footer) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Footer not found." });
    }

    await footer.update(
      {
        title: title || footer.title,
        text: text || footer.text,
        // Only fields that were sent change: null removes the logo, "" clears the content
        attachment_id: attachment_id !== undefined ? attachment_id : footer.attachment_id,
        content: content !== undefined ? content || null : footer.content,
        updated_at: new Date(),
      },
      { transaction: t },
    );

    // Update FooterSections if provided
    if (sections && Array.isArray(sections)) {
      for (const section of sections) {
        if (section.footer_section_id && isUuid(section.footer_section_id)) {
          // update existing
          await FooterSection.update(
            {
              section_name: section.section_name,
              links: section.links,
              updated_at: new Date(),
            },
            {
              where: { footer_section_id: section.footer_section_id },
              transaction: t,
            },
          );
        } else {
          // create new section
          await FooterSection.create(
            {
              footer_section_id: uuidv4(),
              footer_id: footer.footer_id,
              section_name: section.section_name || "Untitled Section",
              links: section.links || [],
              created_at: new Date(),
              updated_at: new Date(),
            },
            { transaction: t },
          );
        }
      }
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: footer,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Update Footer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update footer",
      error: error.message,
    });
  }
};

// ===========================
// DELETE FOOTER (soft delete)
// ===========================
const deleteFooter = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const footer = await Footer.findByPk(id, { transaction: t });
    if (!footer) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Footer not found." });
    }

    await footer.update({ deleted_at: new Date() }, { transaction: t });

    // Soft delete all sections
    await FooterSection.update(
      { deleted_at: new Date() },
      { where: { footer_id: id }, transaction: t },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Footer deleted successfully (soft delete)",
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Delete Footer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete footer",
      error: error.message,
    });
  }
};

module.exports = {
  createFooter,
  getAllFooters,
  getFooterById,
  updateFooter,
  deleteFooter,
};
