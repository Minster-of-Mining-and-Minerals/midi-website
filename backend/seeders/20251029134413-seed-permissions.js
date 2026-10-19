"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const crudActions = ["create", "read", "update", "delete"];
    const resourcesWithActions = [
      { resource: "dashboard", actions: ["view"] },
      { resource: "users", actions: [...crudActions, "assign_role"] },
      { resource: "roles", actions: [...crudActions, "assign_permission"] },
      { resource: "permissions", actions: ["read"] },
      { resource: "news", actions: [...crudActions, "publish"] },
      { resource: "tags", actions: crudActions },
      { resource: "news_feedbacks", actions: ["read", "delete"] },
      { resource: "hero", actions: crudActions },
      { resource: "page_headers", actions: ["read", "update"] },
      { resource: "about", actions: crudActions },
      { resource: "businesses", actions: crudActions },
      { resource: "business_overview", actions: ["read", "update"] },
      { resource: "services", actions: crudActions },
      { resource: "contacts", actions: crudActions },
      { resource: "contact_messages", actions: ["read", "delete"] },
      { resource: "footer", actions: ["read", "update"] },
      { resource: "vacancies", actions: [...crudActions, "publish"] },
      { resource: "audit_logs", actions: ["read", "delete"] },
      { resource: "routes", actions: ["read", "update"] },
      { resource: "attachments", actions: ["create", "read", "delete"] },
      { resource: "products", actions: crudActions },
      { resource: "product_categories", actions: crudActions },
      { resource: "product_inquiries", actions: ["read", "update", "delete", "reply"] },
    ];

    const permissions = resourcesWithActions.flatMap((r) =>
      r.actions.map((action) => ({
        resource: r.resource,
        action: action,
      })),
    );

    for (const perm of permissions) {
      try {
        await queryInterface.bulkInsert(
          "permissions",
          [
            {
              permission_id: uuidv4(),
              resource: perm.resource,
              action: perm.action,
              created_at: now,
              updated_at: now,
            },
          ],
          { ignoreDuplicates: true },
        );
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          console.log(
            `Permission ${perm.resource}:${perm.action} already exists, skipping...`,
          );
          continue;
        }
        throw error;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
