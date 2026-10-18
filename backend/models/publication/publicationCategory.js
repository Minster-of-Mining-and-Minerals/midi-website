"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PublicationCategory extends Model {
    static associate(models) {
      PublicationCategory.belongsToMany(models.Publication, {
        through: "publication_categories_map",
        foreignKey: "category_id",
        otherKey: "publication_id",
        as: "publications",
        timestamps: false,
      });
    }
  }

  PublicationCategory.init(
    {
      category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name_am: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      display_order: {
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
      modelName: "PublicationCategory",
      tableName: "publication_categories",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return PublicationCategory;
};
