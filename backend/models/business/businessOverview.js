"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BusinessOverview extends Model {
    static associate(models) {
      // define association here
    }
  }

  BusinessOverview.init(
    {
      business_overview_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title_part1: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      title_part1_am: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      title_part2: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      title_part2_am: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description1_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description2_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      business_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      business_categories: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      key_metrics: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      operations_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      quick_stats: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      network_operations: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      page_metadata: {
        type: DataTypes.JSON,
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
      modelName: "BusinessOverview",
      tableName: "business_overview",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return BusinessOverview;
};
