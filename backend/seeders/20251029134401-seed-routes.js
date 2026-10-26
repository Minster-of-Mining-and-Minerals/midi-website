"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const routesData = [
      {
        key: "home",
        path: "/",
        order: 1,
        translations: {
          en: "Home",
          am: "መነሻ",
        },
      },
      {
        key: "about",
        path: "/about",
        order: 2,
        translations: {
          en: "About",
          am: "ስለኛ",
        },
      },
      {
        key: "businesses",
        path: "/mineral-industry-development",
        order: 3,
        translations: {
          en: "Mineral Industry Development",
          am: "የማዕድን ኢንዱስትሪ ልማት",
        },
        children: [
          {
            key: "overview",
            path: "/mineral-industry-development/overview",
            order: 1,
            translations: {
              en: "Development Overview",
              am: "የልማት አጠቃላይ እይታ",
            },
          },
          {
            key: "mineral-processing",
            path: "/mineral-industry-development/mineral-processing",
            order: 2,
            translations: {
              en: "Mineral Processing & Beneficiation",
              am: "የማዕድን ማቀነባበሪያ እና ማበልፀጊያ",
            },
          },
          {
            key: "value-addition",
            path: "/mineral-industry-development/value-addition",
            order: 3,
            translations: {
              en: "Manufacturing & Value Addition",
              am: "እሴት መጨመር እና ማኑፋክቸሪንግ",
            },
          },
          {
            key: "research-innovation",
            path: "/mineral-industry-development/research-innovation",
            order: 4,
            translations: {
              en: "Applied Research & Innovation",
              am: "ተግባራዊ ምርምር እና ቴክኖሎጂ",
            },
          },
        ],
      },
      {
        key: "products",
        path: "/products",
        order: 4,
        translations: {
          en: "Products",
          am: "ምርቶች",
        },
      },
      {
        key: "services",
        path: "/services",
        order: 5,
        translations: {
          en: "Services",
          am: "አገልግሎቶች",
        },
      },
      {
        key: "news",
        path: "/news",
        order: 7,
        translations: {
          en: "News",
          am: "ዜና",
        },
      },
      {
        key: "careers",
        path: "/careers",
        order: 8,
        translations: {
          en: "Careers",
          am: "ስራዎች",
        },
      },
      {
        key: "contact",
        path: "/contact",
        order: 9,
        translations: {
          en: "Contact",
          am: "እውቂያ",
        },
      },
    ];

    const existingRoutesList = await queryInterface.sequelize.query(
      `SELECT route_id, path FROM routes;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingRoutesMap = {};
    if (existingRoutesList && existingRoutesList.length > 0) {
      existingRoutesList.forEach(r => {
        existingRoutesMap[r.path] = r.route_id;
      });
    }

    const routes = [];
    const translations = [];
    const allRouteIds = new Set(); // Track all created route IDs

    for (const route of routesData) {
      let routeId = existingRoutesMap[route.path];

      if (!routeId) {
        routeId = uuidv4();
        allRouteIds.add(routeId);

        // ================= ROOT ROUTE =================
        routes.push({
          route_id: routeId,
          path: route.path,
          parent_id: null,
          order: route.order,
          is_active: true,
          show_in_navbar: true,
          created_at: now,
          updated_at: now,
        });

        Object.entries(route.translations).forEach(([lang, label]) => {
          translations.push({
            route_translation_id: uuidv4(),
            route_id: routeId,
            language_code: lang,
            label,
            created_at: now,
            updated_at: now,
          });
        });
      } else {
        allRouteIds.add(routeId);
      }

      // ================= CHILD ROUTES =================
      if (route.children?.length) {
        route.children.forEach((child) => {
          let childId = existingRoutesMap[child.path];

          if (!childId) {
            childId = uuidv4();
            allRouteIds.add(childId);

            routes.push({
              route_id: childId,
              path: child.path,
              parent_id: routeId, // This links to parent
              order: child.order,
              is_active: true,
              show_in_navbar: true,
              created_at: now,
              updated_at: now,
            });

            Object.entries(child.translations).forEach(([lang, label]) => {
              translations.push({
                route_translation_id: uuidv4(),
                route_id: childId,
                language_code: lang,
                label,
                created_at: now,
                updated_at: now,
              });
            });
          } else {
            allRouteIds.add(childId);
          }
        });
      }
    }

    // Insert fresh data
    if (routes.length > 0) {
      await queryInterface.bulkInsert("routes", routes, { ignoreDuplicates: true });
    }
    if (translations.length > 0) {
      await queryInterface.bulkInsert("route_translations", translations, { ignoreDuplicates: true });
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("route_translations", null, {});
    await queryInterface.bulkDelete("routes", null, {});
  },
};