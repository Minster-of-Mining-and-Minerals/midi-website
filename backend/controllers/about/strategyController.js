"use strict";

const {
  Strategy,
  StrategySection,
  Attachment,
  CoreValue,
  sequelize,
} = require("../../models");

const { v4: uuidv4, validate: isUuid } = require("uuid");

// ============================================
// Helper: Prepare Sections + CoreValues
// ============================================

const prepareStrategyData = (sections = [], strategyId) => {
  const sectionRows = [];
  const coreValueRows = [];

  sections.forEach((sec) => {
    const sectionId = uuidv4();

    // Icon image is optional; the public page shows a fallback icon without one
    sectionRows.push({
      section_id: sectionId,
      strategy_id: strategyId,
      type: sec.type,
      title: sec.title,
      attachment_id: sec.attachment_id || null,
      content: sec.content || null,
      content_am: sec.content_am || null,
    });

    if (sec.type === "core_values" && Array.isArray(sec.core_values)) {
      sec.core_values.forEach((value, index) => {
        coreValueRows.push({
          value_id: uuidv4(),
          section_id: sectionId,
          title: value.title,
          content: value.content || null,
          title_am: value.title_am || null,
          content_am: value.content_am || null,
          // Keep the order the admin arranged the values in
          display_order: index,
        });
      });
    }
  });

  return { sectionRows, coreValueRows };
};

// ============================================
// CREATE STRATEGY
// ============================================

const createStrategy = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { title, description, title_am, description_am, sections } = req.body;

    if (!title) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Strategy title is required",
      });
    }

    const strategyId = uuidv4();

    const strategy = await Strategy.create(
      {
        strategy_id: strategyId,
        title,
        description,
        title_am: title_am || null,
        description_am: description_am || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t },
    );

    if (Array.isArray(sections) && sections.length > 0) {
      const { sectionRows, coreValueRows } = prepareStrategyData(
        sections,
        strategyId,
      );

      if (sectionRows.length > 0) {
        await StrategySection.bulkCreate(sectionRows, { transaction: t });
      }

      if (coreValueRows.length > 0) {
        await CoreValue.bulkCreate(coreValueRows, { transaction: t });
      }
    }

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Strategy created successfully",
      data: strategy,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();

    console.error("Create Strategy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create strategy",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE STRATEGY
// ============================================

const updateStrategy = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { title, description, title_am, description_am, sections } = req.body;

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid strategy ID",
      });
    }

    const strategy = await Strategy.findByPk(id, { transaction: t });

    if (!strategy) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    await strategy.update(
      {
        title,
        description,
        // Only change the Amharic fields when they are sent ("" clears them)
        ...(title_am !== undefined && { title_am: title_am || null }),
        ...(description_am !== undefined && { description_am: description_am || null }),
        updated_at: new Date(),
      },
      { transaction: t },
    );

    if (Array.isArray(sections)) {
      // Delete old core values
      const existingSections = await StrategySection.findAll({
        where: { strategy_id: id },
        attributes: ["section_id"],
        transaction: t,
      });

      const sectionIds = existingSections.map((s) => s.section_id);

      if (sectionIds.length > 0) {
        await CoreValue.destroy({
          where: { section_id: sectionIds },
          transaction: t,
        });
      }

      await StrategySection.destroy({
        where: { strategy_id: id },
        transaction: t,
      });

      // Create new sections & core values using attachment_id
      const { sectionRows, coreValueRows } = prepareStrategyData(sections, id);

      if (sectionRows.length > 0) {
        await StrategySection.bulkCreate(sectionRows, { transaction: t });
      }

      if (coreValueRows.length > 0) {
        await CoreValue.bulkCreate(coreValueRows, { transaction: t });
      }
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Strategy updated successfully",
      data: strategy,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();

    console.error("Update Strategy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update strategy",
      error: error.message,
    });
  }
};

// ============================================
// GET ALL STRATEGIES
// ============================================

const getAllStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.findAll({
      include: [
        {
          model: StrategySection,
          as: "sections",
          include: [
            {
              model: CoreValue,
              as: "core_values",
            },
            {
              model: Attachment,
              as: "attachment", // Include attachment for sections
            },
          ],
        },
      ],
      // Newest strategy first; core values in the order the admin arranged them
      order: [
        ["created_at", "DESC"],
        [{ model: StrategySection, as: "sections" }, { model: CoreValue, as: "core_values" }, "display_order", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      count: strategies.length,
      data: strategies,
    });
  } catch (error) {
    console.error("Fetch Strategies Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch strategies",
      error: error.message,
    });
  }
};

// ============================================
// GET STRATEGY BY ID
// ============================================

const getStrategyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid strategy ID",
      });
    }

    const strategy = await Strategy.findByPk(id, {
      include: [
        {
          model: StrategySection,
          as: "sections",
          include: [
            {
              model: CoreValue,
              as: "core_values",
            },
            {
              model: Attachment,
              as: "attachment", // Include attachment for sections
            },
          ],
        },
      ],
      order: [[{ model: StrategySection, as: "sections" }, { model: CoreValue, as: "core_values" }, "display_order", "ASC"]],
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: strategy,
    });
  } catch (error) {
    console.error("Get Strategy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch strategy",
      error: error.message,
    });
  }
};

// ============================================
// DELETE STRATEGY
// ============================================

const deleteStrategy = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid strategy ID",
      });
    }

    const strategy = await Strategy.findByPk(id, { transaction: t });

    if (!strategy) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    const sections = await StrategySection.findAll({
      where: { strategy_id: id },
      attributes: ["section_id"],
      transaction: t,
    });

    const sectionIds = sections.map((s) => s.section_id);

    if (sectionIds.length > 0) {
      await CoreValue.destroy({
        where: { section_id: sectionIds },
        transaction: t,
      });
    }

    await StrategySection.destroy({
      where: { strategy_id: id },
      transaction: t,
    });

    await strategy.destroy({ transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Strategy deleted successfully",
    });
  } catch (error) {
    if (!t.finished) await t.rollback();

    console.error("Delete Strategy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete strategy",
      error: error.message,
    });
  }
};

module.exports = {
  createStrategy,
  getAllStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
};
