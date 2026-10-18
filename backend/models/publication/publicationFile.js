"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublicationFile extends Model {
    static associate(models) {
      PublicationFile.belongsTo(models.Publication, {
        foreignKey: "publication_id",
        as: "publication",
      });

      PublicationFile.belongsTo(models.Attachment, {
        foreignKey: "attachment_id",
        as: "attachment",
      });
    }
  }

  PublicationFile.init(
    {
      publication_file_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      publication_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      attachment_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      file_role: {
        type: DataTypes.ENUM(
          "main_pdf",
          "supplementary_pdf",
          "map_document",
          "cover_image",
          "other_attachment"
        ),
        defaultValue: "main_pdf",
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      file_size: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      mime_type: {
        type: DataTypes.STRING(100),
        defaultValue: "application/pdf",
        allowNull: false,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      downloads_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
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
      modelName: "PublicationFile",
      tableName: "publication_files",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return PublicationFile;
};
