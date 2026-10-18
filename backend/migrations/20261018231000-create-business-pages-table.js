"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists("business_pages");
    if (!tableExists) {
      await queryInterface.createTable("business_pages", {
        business_page_id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        slug: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        title_am: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        subtitle: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        subtitle_am: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        summary_am: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        content_am: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        cover_image_id: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        sections_data: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        publish_status: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: "published",
        },
        display_order: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      });

      await queryInterface.addIndex("business_pages", ["slug"], {
        unique: true,
        name: "business_pages_slug_unique",
      });
      await queryInterface.addIndex("business_pages", ["display_order"], {
        name: "business_pages_display_order_idx",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists("business_pages");
    if (tableExists) {
      await queryInterface.dropTable("business_pages");
    }
  },
};
