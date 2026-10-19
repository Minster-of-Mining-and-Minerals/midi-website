"use strict";

const { v4: uuidv4 } = require("uuid");
const {
  tableExists,
  createTableIfNotExists,
  dropTableIfExists,
} = require("./lib/migration-utils");

const SUPER_ADMIN_ROLE_ID = "00000000-0000-4000-8000-000000000002";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Remove Facilities-specific role-permission mappings
      if (await tableExists(queryInterface, "role_permissions")) {
        await queryInterface.sequelize.query(
          `DELETE FROM role_permissions
           WHERE permission_id IN (
             SELECT permission_id FROM permissions WHERE resource = 'facilities'
           );`,
          { transaction }
        );
      }

      // 2. Remove Facilities-specific permissions
      if (await tableExists(queryInterface, "permissions")) {
        await queryInterface.sequelize.query(
          `DELETE FROM permissions WHERE resource = 'facilities';`,
          { transaction }
        );
      }

      // 3. Remove Facilities route and translations
      if (await tableExists(queryInterface, "routes")) {
        if (await tableExists(queryInterface, "route_translations")) {
          await queryInterface.sequelize.query(
            `DELETE FROM route_translations
             WHERE route_id IN (
               SELECT route_id FROM routes WHERE path = '/facilities'
             );`,
            { transaction }
          );
        }

        await queryInterface.sequelize.query(
          `DELETE FROM routes WHERE path = '/facilities';`,
          { transaction }
        );
      }

      // 4. Remove Facilities page_header record
      if (await tableExists(queryInterface, "page_headers")) {
        await queryInterface.sequelize.query(
          `DELETE FROM page_headers WHERE page_identifier = 'facilities';`,
          { transaction }
        );
      }

      // 5. Drop Facilities-owned tables
      await dropTableIfExists(queryInterface, "facilities", { transaction });
      await dropTableIfExists(queryInterface, "facility_footprint", { transaction });
      await dropTableIfExists(queryInterface, "facility_overview", { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Recreate facility_overview table
      await createTableIfNotExists(
        queryInterface,
        "facility_overview",
        {
          facility_overview_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          heading: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          subheading: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          image: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          list_heading: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // 2. Recreate facilities table
      await createTableIfNotExists(
        queryInterface,
        "facilities",
        {
          facility_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          location: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          map_url: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          short_description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          image: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          order: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // 3. Recreate facility_footprint table
      await createTableIfNotExists(
        queryInterface,
        "facility_footprint",
        {
          facility_footprint_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          heading: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          locations: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          card_heading: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          card_description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // 4. Restore permissions for resource 'facilities'
      if (await tableExists(queryInterface, "permissions")) {
        const now = new Date();
        const crudActions = ["create", "read", "update", "delete"];

        for (const action of crudActions) {
          const permId = uuidv4();
          await queryInterface.sequelize.query(
            `INSERT INTO permissions (permission_id, resource, action, is_active, created_at, updated_at)
             VALUES (:permission_id, 'facilities', :action, true, :now, :now)
             ON CONFLICT (resource, action) DO NOTHING;`,
            {
              replacements: { permission_id: permId, action, now },
              transaction,
            }
          );

          if (await tableExists(queryInterface, "role_permissions")) {
            const [rows] = await queryInterface.sequelize.query(
              `SELECT permission_id FROM permissions WHERE resource = 'facilities' AND action = :action LIMIT 1;`,
              { replacements: { action }, transaction }
            );
            const actualPermId = rows?.[0]?.permission_id || permId;

            const [roles] = await queryInterface.sequelize.query(
              `SELECT role_id FROM roles WHERE role_id = :roleId LIMIT 1;`,
              { replacements: { roleId: SUPER_ADMIN_ROLE_ID }, transaction }
            );

            if (roles?.length) {
              await queryInterface.sequelize.query(
                `INSERT INTO role_permissions (role_permission_id, role_id, permission_id, is_active, created_at, updated_at)
                 VALUES (:role_permission_id, :role_id, :permission_id, true, :now, :now)
                 ON CONFLICT (role_id, permission_id) DO NOTHING;`,
                {
                  replacements: {
                    role_permission_id: uuidv4(),
                    role_id: SUPER_ADMIN_ROLE_ID,
                    permission_id: actualPermId,
                    now,
                  },
                  transaction,
                }
              );
            }
          }
        }
      }

      // 5. Restore /facilities route
      if (await tableExists(queryInterface, "routes")) {
        const now = new Date();
        const routeId = uuidv4();
        await queryInterface.sequelize.query(
          `INSERT INTO routes (route_id, path, "order", is_active, show_in_navbar, created_at, updated_at)
           VALUES (:routeId, '/facilities', 6, true, true, :now, :now);`,
          {
            replacements: { routeId, now },
            transaction,
          }
        );

        if (await tableExists(queryInterface, "route_translations")) {
          await queryInterface.bulkInsert(
            "route_translations",
            [
              {
                translation_id: uuidv4(),
                route_id: routeId,
                language_code: "en",
                label: "Facilities",
                created_at: now,
                updated_at: now,
              },
              {
                translation_id: uuidv4(),
                route_id: routeId,
                language_code: "am",
                label: "መገልገያዎች",
                created_at: now,
                updated_at: now,
              },
            ],
            { transaction }
          );
        }
      }

      // 6. Restore page_headers for 'facilities'
      if (await tableExists(queryInterface, "page_headers")) {
        await queryInterface.sequelize.query(
          `INSERT INTO page_headers (page_header_id, page_identifier, title, description, icon, attachment_id)
           VALUES (:id, 'facilities', 'Our Facilities', 'Strategic facilities and infrastructure that support Jarra Holdings’ growing business operations and long-term investments.', 'LucideBuilding2', NULL)
           ON CONFLICT (page_identifier) DO NOTHING;`,
          {
            replacements: { id: uuidv4() },
            transaction,
          }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
