"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add bilingual fields to business_overview
    const overviewTable = await queryInterface.describeTable("business_overview");
    if (!overviewTable.title_part1_am) {
      await queryInterface.addColumn("business_overview", "title_part1_am", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!overviewTable.title_part2_am) {
      await queryInterface.addColumn("business_overview", "title_part2_am", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!overviewTable.description1_am) {
      await queryInterface.addColumn("business_overview", "description1_am", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (!overviewTable.description2_am) {
      await queryInterface.addColumn("business_overview", "description2_am", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // 2. Add bilingual fields to business_nodes
    const nodesTable = await queryInterface.describeTable("business_nodes");
    if (!nodesTable.title_am) {
      await queryInterface.addColumn("business_nodes", "title_am", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!nodesTable.description_am) {
      await queryInterface.addColumn("business_nodes", "description_am", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const overviewTable = await queryInterface.describeTable("business_overview");
    if (overviewTable.title_part1_am) {
      await queryInterface.removeColumn("business_overview", "title_part1_am");
    }
    if (overviewTable.title_part2_am) {
      await queryInterface.removeColumn("business_overview", "title_part2_am");
    }
    if (overviewTable.description1_am) {
      await queryInterface.removeColumn("business_overview", "description1_am");
    }
    if (overviewTable.description2_am) {
      await queryInterface.removeColumn("business_overview", "description2_am");
    }

    const nodesTable = await queryInterface.describeTable("business_nodes");
    if (nodesTable.title_am) {
      await queryInterface.removeColumn("business_nodes", "title_am");
    }
    if (nodesTable.description_am) {
      await queryInterface.removeColumn("business_nodes", "description_am");
    }
  },
};
