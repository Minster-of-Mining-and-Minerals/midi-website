"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Background extends Model {
        static associate(models) {
            Background.hasMany(models.BackgroundAttachment, {
                foreignKey: "background_id",
                as: "attachments",
            });
        }
    }

    Background.init(
        {
            background_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            icon: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: "",
            },
            title_am: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            description_am: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Background",
            tableName: "backgrounds",
            timestamps: false,
            underscored: true,
        }
    );

    return Background;
};