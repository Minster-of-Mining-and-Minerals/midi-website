"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Initial Suggested Categories for MIDI Publications
    const categories = [
      {
        name: "Research Reports",
        name_am: "የምርምር ሪፖርቶች",
        slug: "research-reports",
        description: "Official research papers, mineralogical assessments, and scientific publications by MIDI.",
        description_am: "በማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት የተዘጋጁ ይፋዊ የምርምር ጽሁፎች እና ሳይንሳዊ ህትመቶች።",
        display_order: 1,
      },
      {
        name: "Mineral Maps",
        name_am: "የማዕድን ካርታዎች",
        slug: "mineral-maps",
        description: "Geological maps, mineral deposit distribution charts, and regional exploration cartography.",
        description_am: "የጂኦሎጂካል ካርታዎች፣ የማዕድን ክምችት ስርጭት እና የክልል ፍለጋ ካርታዎች።",
        display_order: 2,
      },
      {
        name: "Books and Manuals",
        name_am: "መጽሐፍት እና መመሪያዎች",
        slug: "books-and-manuals",
        description: "Comprehensive mineral processing handbooks, technical manuals, and reference literature.",
        description_am: "የማዕድን ማቀነባበሪያ አጠቃላይ መመሪያዎች፣ የቴክኒክ ማንዋሎች እና የማመሳከሪያ ጽሁፎች።",
        display_order: 3,
      },
      {
        name: "Technical Publications",
        name_am: "ቴክኒካዊ ህትመቶች",
        slug: "technical-publications",
        description: "Engineering bulletins, laboratory testing methodologies, and mineral beneficiation studies.",
        description_am: "የኢንጂነሪንግ መግለጫዎች፣ የላብራቶሪ ምርመራ ዘዴዎች እና የማዕድን ማበልጸጊያ ጥናቶች።",
        display_order: 4,
      },
      {
        name: "Geological and Mineral Studies",
        name_am: "የጂኦሎጂ እና ማዕድን ጥናቶች",
        slug: "geological-and-mineral-studies",
        description: "Detailed geological survey reports, stratigraphy, geochemical data, and structural analyses.",
        description_am: "ዝርዝር የጂኦሎጂካል ቅኝት ሪፖርቶች፣ የጂኦኬሚካል መረጃዎች እና መዋቅራዊ ትንተናዎች።",
        display_order: 5,
      },
      {
        name: "Training Materials",
        name_am: "የስልጠና ቁሳቁሶች",
        slug: "training-materials",
        description: "Curriculum guides, artisanal mining training modules, and capacity-building resources.",
        description_am: "የስልጠና ሞጁሎች፣ ለአነስተኛ አምራቾች የተዘጋጁ መመሪያዎች እና የአቅም ግንባታ ሰነዶች።",
        display_order: 6,
      },
      {
        name: "Policy and Strategy Documents",
        name_am: "የፖሊሲ እና ስትራቴጂ ሰነዶች",
        slug: "policy-and-strategy-documents",
        description: "National mineral sector development policies, regulatory guidelines, and roadmaps.",
        description_am: "የብሔራዊ ማዕድን ዘርፍ ልማት ፖሊሲዎች፣ የቁጥጥር መመሪያዎች እና የልማት ስትራቴጂዎች።",
        display_order: 7,
      },
      {
        name: "Other Publications",
        name_am: "ሌሎች ህትመቶች",
        slug: "other-publications",
        description: "Institutional bulletins, annual reports, symposium proceedings, and public notices.",
        description_am: "ተቋማዊ ቡሌቲኖች፣ ዓመታዊ ሪፖርቶች እና የሲምፖዚየም ማጠቃለያዎች።",
        display_order: 8,
      },
    ];

    for (const cat of categories) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT category_id FROM publication_categories WHERE slug = :slug LIMIT 1;`,
        { replacements: { slug: cat.slug } }
      );

      if (!existing || existing.length === 0) {
        await queryInterface.bulkInsert("publication_categories", [
          {
            category_id: uuidv4(),
            name: cat.name,
            name_am: cat.name_am,
            slug: cat.slug,
            description: cat.description,
            description_am: cat.description_am,
            display_order: cat.display_order,
            is_active: true,
            created_at: now,
            updated_at: now,
          },
        ]);
      }
    }

    // 2. Update Dynamic Route in `routes` table: Replace `/products` with `/publications`
    try {
      const [productRoute] = await queryInterface.sequelize.query(
        `SELECT route_id FROM routes WHERE path = '/products' LIMIT 1;`
      );

      if (productRoute && productRoute.length > 0) {
        const routeId = productRoute[0].route_id;
        await queryInterface.sequelize.query(
          `UPDATE routes SET path = '/publications', updated_at = :now WHERE route_id = :routeId;`,
          { replacements: { now, routeId } }
        );

        // Update translations
        await queryInterface.sequelize.query(
          `UPDATE route_translations SET label = 'Publications & Research', updated_at = :now 
           WHERE route_id = :routeId AND language_code = 'en';`,
          { replacements: { now, routeId } }
        );

        await queryInterface.sequelize.query(
          `UPDATE route_translations SET label = 'ህትመቶች እና ምርምር', updated_at = :now 
           WHERE route_id = :routeId AND language_code = 'am';`,
          { replacements: { now, routeId } }
        );
      }
    } catch (err) {
      console.warn("Route update notice:", err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Optional down script
  },
};
