"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublicationPayment extends Model {
    static associate(models) {
      PublicationPayment.belongsTo(models.PublicationInquiry, {
        foreignKey: "inquiry_id",
        as: "inquiry",
      });

      PublicationPayment.belongsTo(models.Publication, {
        foreignKey: "publication_id",
        as: "publication",
      });

      PublicationPayment.belongsTo(models.Attachment, {
        foreignKey: "slip_attachment_id",
        as: "slipAttachment",
      });

      PublicationPayment.belongsTo(models.User, {
        foreignKey: "verified_by",
        as: "verifier",
      });
    }
  }

  PublicationPayment.init(
    {
      payment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      inquiry_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      publication_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        defaultValue: "ETB",
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("bank_transfer", "telebirr_manual", "cbe_birr", "other"),
        defaultValue: "bank_transfer",
        allowNull: false,
      },
      transaction_reference: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slip_attachment_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("submitted", "under_verification", "verified", "rejected"),
        defaultValue: "submitted",
        allowNull: false,
      },
      verified_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      admin_notes: {
        type: DataTypes.TEXT,
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
      modelName: "PublicationPayment",
      tableName: "publication_payments",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return PublicationPayment;
};
