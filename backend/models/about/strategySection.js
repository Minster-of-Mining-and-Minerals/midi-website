"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StrategySection extends Model {
    static associate(models) {
      StrategySection.belongsTo(models.Strategy, {
        foreignKey: "strategy_id",
        as: "strategy",
      });

      StrategySection.belongsTo(models.Attachment, {
        foreignKey: "attachment_id",
        as: "attachment",
      });

      // For core values only
      StrategySection.hasMany(models.CoreValue, {
        foreignKey: "section_id",
        as: "core_values",
      });
    }
  }

  StrategySection.init(
    {
      section_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      strategy_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        // 'mission', 'vision', 'core_values'
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Optional icon image; the public page falls back to a letter icon
      attachment_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "attachments",
          key: "attachment_id",
        },
        onUpdate: "CASCADE", 
        onDelete: "RESTRICT", 
      },
      content: {
        type: DataTypes.TEXT,
      },
      content_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "StrategySection",
      tableName: "strategy_sections",
      timestamps: false,
      underscored: true,
    },
  );

  return StrategySection;
};
