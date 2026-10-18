"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BusinessPage extends Model {
    static associate(models) {
      if (models.Attachment) {
        BusinessPage.belongsTo(models.Attachment, {
          foreignKey: "cover_image_id",
          as: "cover_image",
        });
      }
    }
  }

  BusinessPage.init(
    {
      business_page_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      title_am: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      subtitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      subtitle_am: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      summary_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cover_image_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      sections_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      publish_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "published",
      },
      display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BusinessPage",
      tableName: "business_pages",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return BusinessPage;
};
