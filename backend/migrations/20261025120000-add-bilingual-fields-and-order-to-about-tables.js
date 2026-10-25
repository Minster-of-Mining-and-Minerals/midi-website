"use strict";

const { addColumnIfNotExists, removeColumnIfExists } = require("./lib/migration-utils");

/**
 * About page: Amharic (_am) versions of the visible text fields, and a display order
 * for leaders so siblings can be reordered. Columns are only added (all nullable, or
 * defaulted), so existing data is untouched and the migration is safe to re-run.
 */
const COLUMNS = (Sequelize) => [
  ["backgrounds", "title_am", { type: Sequelize.STRING(255), allowNull: true }],
  ["backgrounds", "description_am", { type: Sequelize.TEXT, allowNull: true }],

  ["strategies", "title_am", { type: Sequelize.STRING(255), allowNull: true }],
  ["strategies", "description_am", { type: Sequelize.TEXT, allowNull: true }],
  ["strategy_sections", "content_am", { type: Sequelize.TEXT, allowNull: true }],
  ["core_values", "title_am", { type: Sequelize.STRING(255), allowNull: true }],
  ["core_values", "content_am", { type: Sequelize.TEXT, allowNull: true }],
  ["core_values", "display_order", { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }],

  ["leadership", "name_am", { type: Sequelize.STRING(255), allowNull: true }],
  ["leadership", "title_am", { type: Sequelize.STRING(255), allowNull: true }],
  ["leadership", "description_am", { type: Sequelize.TEXT, allowNull: true }],
  ["leadership", "display_order", { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }],

  ["certifications", "title_am", { type: Sequelize.STRING(255), allowNull: true }],
  ["certifications", "description_am", { type: Sequelize.TEXT, allowNull: true }],
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // backgrounds.description was VARCHAR(255); the About intro is longer than that
    await queryInterface.changeColumn("backgrounds", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    // Mission / vision / core values icons are optional (the public page has fallback icons).
    // Plain ALTER so the existing foreign key to attachments is left as it is.
    await queryInterface.sequelize.query(
      "ALTER TABLE strategy_sections ALTER COLUMN attachment_id DROP NOT NULL"
    );

    for (const [table, column, attributes] of COLUMNS(Sequelize)) {
      await addColumnIfNotExists(queryInterface, table, column, attributes);
    }
  },

  // On rollback backgrounds.description stays TEXT and strategy_sections.attachment_id stays
  // nullable: reverting either could fail on data saved since (long text, sections without icons)
  async down(queryInterface, Sequelize) {
    for (const [table, column] of COLUMNS(Sequelize).reverse()) {
      await removeColumnIfExists(queryInterface, table, column);
    }
  },
};
