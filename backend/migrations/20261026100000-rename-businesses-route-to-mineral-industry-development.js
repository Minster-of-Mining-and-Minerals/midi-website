"use strict";

const { tableExists, columnExists } = require("./lib/migration-utils");

/**
 * The public "/businesses" section is now "/mineral-industry-development".
 * Moves the stored links (navbar routes, hero buttons, footer links) to the new path.
 * Old links keep working through the redirect in frontend/next.config.ts.
 */

const OLD = "/businesses";
const NEW = "/mineral-industry-development";

// Plain URL columns: "/businesses", "/businesses/...", optionally behind "/en" or "/am"
const URL_COLUMNS = [
  ["routes", "path"],
  ["sliders", "button_url"],
  ["sliders", "button2_url"],
  ["cards", "button_url"],
  ["import_export_overview", "cta_button_url"],
];

// JSON columns holding { url } entries
const JSON_COLUMNS = [["footer_sections", "links"]];

async function rewrite(queryInterface, from, to) {
  const sequelize = queryInterface.sequelize;
  const fromRe = from.replace(/\//g, "\\/");

  for (const [table, column] of URL_COLUMNS) {
    if (!(await tableExists(queryInterface, table)) || !(await columnExists(queryInterface, table, column))) continue;
    await sequelize.query(
      `UPDATE "${table}"
         SET "${column}" = regexp_replace("${column}", :pattern, :replacement)
       WHERE "${column}" ~ :pattern`,
      { replacements: { pattern: `^(/(en|am))?${fromRe}(?=/|$)`, replacement: `\\1${to}` } }
    );
  }

  for (const [table, column] of JSON_COLUMNS) {
    if (!(await tableExists(queryInterface, table)) || !(await columnExists(queryInterface, table, column))) continue;
    await sequelize.query(
      `UPDATE "${table}"
         SET "${column}" = CAST(regexp_replace(CAST("${column}" AS text), :pattern, :replacement, 'g') AS json)
       WHERE CAST("${column}" AS text) ~ :pattern`,
      { replacements: { pattern: `"(/(en|am))?${fromRe}(?=["/])`, replacement: `"\\1${to}` } }
    );
  }
}

module.exports = {
  async up(queryInterface) {
    await rewrite(queryInterface, OLD, NEW);
  },

  async down(queryInterface) {
    await rewrite(queryInterface, NEW, OLD);
  },
};
