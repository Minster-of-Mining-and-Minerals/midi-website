"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublicationAccessGrant extends Model {
    static associate(models) {
      PublicationAccessGrant.belongsTo(models.Publication, {
        foreignKey: "publication_id",
        as: "publication",
      });

      PublicationAccessGrant.belongsTo(models.PublicationInquiry, {
        foreignKey: "inquiry_id",
        as: "inquiry",
      });

      PublicationAccessGrant.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      PublicationAccessGrant.belongsTo(models.User, {
        foreignKey: "granted_by",
        as: "grantor",
      });
    }
  }

  PublicationAccessGrant.init(
    {
      grant_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      publication_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      inquiry_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      access_token: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      access_level: {
        type: DataTypes.ENUM("online_only", "download_allowed"),
        defaultValue: "online_only",
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      downloads_used: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      max_downloads: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      granted_by: {
        type: DataTypes.UUID,
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
    },
    {
      sequelize,
      modelName: "PublicationAccessGrant",
      tableName: "publication_access_grants",
      timestamps: false,
      underscored: true,
    }
  );

  return PublicationAccessGrant;
};
