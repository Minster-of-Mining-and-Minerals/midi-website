"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BusinessNode extends Model {
    static associate(models) {
      // define association here
    }
  }

  BusinessNode.init(
    {
      business_node_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_string: {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description_am: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      position_x: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      position_y: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      mobile_order: {
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
      modelName: "BusinessNode",
      tableName: "business_nodes",
      timestamps: false,
      underscored: true,
      paranoid: true,
    }
  );

  return BusinessNode;
};
