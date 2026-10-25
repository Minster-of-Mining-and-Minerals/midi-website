"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Leadership extends Model {
        static associate(models) {
            // Self-referencing for parent-child relationship
            Leadership.belongsTo(models.Leadership, {
                foreignKey: "parent_id",
                as: "parent",
            });
            Leadership.hasMany(models.Leadership, {
                foreignKey: "parent_id",
                as: "children",
            });

            Leadership.hasOne(models.LeadershipAttachment, {
                foreignKey: "leadership_id",
                as: "attachments",
            });
        }
    }

    Leadership.init(
        {
            leadership_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                field: "leadership_id",
            },
            header: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "Ministry of Mines",
            },
            parent_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            level: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            name_am: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            title_am: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            description_am: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            // Position among leaders with the same parent (lower shows first)
            display_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: "Leadership",
            tableName: "leadership",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
            paranoid: true,
        }
    );

    return Leadership;
};