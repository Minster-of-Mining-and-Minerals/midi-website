"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    static associate(models) {
      Publication.belongsToMany(models.PublicationCategory, {
        through: "publication_categories_map",
        foreignKey: "publication_id",
        otherKey: "category_id",
        as: "categories",
        timestamps: false,
      });

      Publication.hasMany(models.PublicationFile, {
        foreignKey: "publication_id",
        as: "files",
      });

      Publication.hasMany(models.PublicationInquiry, {
        foreignKey: "publication_id",
        as: "inquiries",
      });

      Publication.hasMany(models.PublicationPayment, {
        foreignKey: "publication_id",
        as: "payments",
      });

      Publication.hasMany(models.PublicationAccessGrant, {
        foreignKey: "publication_id",
        as: "accessGrants",
      });

      Publication.belongsTo(models.Attachment, {
        foreignKey: "cover_image_id",
        as: "coverImage",
      });

      Publication.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });

      Publication.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }

  Publication.init(
    {
      publication_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      title_am: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      summary_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      authors: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      publication_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      document_type: {
        type: DataTypes.ENUM(
          "research_report",
          "mineral_map",
          "book_manual",
          "technical_publication",
          "geological_study",
          "training_material",
          "policy_strategy",
          "other"
        ),
        defaultValue: "research_report",
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(50),
        defaultValue: "en",
        allowNull: false,
      },
      reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      page_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      publish_status: {
        type: DataTypes.ENUM("draft", "pending_review", "published", "archived"),
        defaultValue: "draft",
        allowNull: false,
      },
      access_mode: {
        type: DataTypes.ENUM("open_access", "online_only", "enquiry_required", "restricted"),
        defaultValue: "open_access",
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        defaultValue: "ETB",
        allowNull: false,
      },
      cover_image_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      views_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      downloads_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
      modelName: "Publication",
      tableName: "publications",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return Publication;
};
