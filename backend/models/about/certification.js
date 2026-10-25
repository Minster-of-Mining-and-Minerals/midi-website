"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Certification extends Model {
    static associate(models) {
      Certification.hasMany(models.CertificationAttachment, {
        foreignKey: "certification_id",
        as: "attachments",
        onDelete: "CASCADE",
      });
    }
  }

  Certification.init(
    {
      certification_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      title_am: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Certification",
      tableName: "certifications",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return Certification;
};
