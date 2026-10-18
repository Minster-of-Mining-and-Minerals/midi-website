"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublicationInquiry extends Model {
    static associate(models) {
      PublicationInquiry.belongsTo(models.Publication, {
        foreignKey: "publication_id",
        as: "publication",
      });

      PublicationInquiry.hasOne(models.PublicationPayment, {
        foreignKey: "inquiry_id",
        as: "payment",
      });

      PublicationInquiry.hasMany(models.PublicationAccessGrant, {
        foreignKey: "inquiry_id",
        as: "accessGrants",
      });

      PublicationInquiry.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "assignee",
      });

      PublicationInquiry.belongsTo(models.User, {
        foreignKey: "reviewed_by",
        as: "reviewer",
      });
    }
  }

  PublicationInquiry.init(
    {
      inquiry_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      publication_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      inquiry_type: {
        type: DataTypes.ENUM(
          "general_inquiry",
          "document_request",
          "access_request",
          "paid_publication_request"
        ),
        defaultValue: "general_inquiry",
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reference_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "under_review",
          "payment_pending",
          "approved",
          "rejected",
          "closed"
        ),
        defaultValue: "pending",
        allowNull: false,
      },
      admin_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assigned_to: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reviewed_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reviewed_at: {
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
      modelName: "PublicationInquiry",
      tableName: "publication_inquiries",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return PublicationInquiry;
};
