"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Seed or Update business_overview with institutional MIDI content
    const existingOverviews = await queryInterface.sequelize.query(
      `SELECT business_overview_id FROM business_overview LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const institutionalData = {
      title_part1: "Mineral Value Chain &",
      title_part1_am: "የማዕድን እሴት ሰንሰለት እና",
      title_part2: "Industrial Beneficiation",
      title_part2_am: "የኢንዱስትሪ ማቀነባበሪያ",
      description1:
        "Spearheading sustainable mineral industry development across Ethiopia through applied research, technical consultancy, high-level capacity building, and specialized laboratory testing.",
      description1_am:
        "በተግባራዊ ምርምር፣ በቴክኒክ ማማከር፣ በከፍተኛ ደረጃ አቅም ግንባታ እና በልዩ የላቦራቶሪ ምርመራ አማካኝነት በመላው ኢትዮጵያ ዘላቂ የማዕድን ኢንዱስትሪ ልማትን መምራት።",
      description2:
        "From geological extraction to high-value industrial manufacturing, MIDI bridges the gap between raw natural mineral resources and modern industrial competitiveness.",
      description2_am:
        "ከጂኦሎጂካል ቁፋሮ ጀምሮ እስከ ከፍተኛ ዋጋ ያላቸው የኢንዱስትሪ ምርቶች ድረስ፣ ተቋሙ በጥሬ የተፈጥሮ ማዕድን ሀብቶች እና በዘመናዊ የማኑፋክቸሪንግ ተወዳዳሪነት መካከል ያለውን ክፍተት ያገናኛል።",
      business_data: JSON.stringify([
        {
          title: "Mineral Industry Development Framework",
          heading: "Mandated Institutional Technical Support Across the National Mineral Spectrum",
          description:
            "Established under Proclamation No. 1263/2014 and Regulation No. 508/2022, MIDI accelerates value addition, domestic manufacturing integration, and import substitution across priority mineral sub-sectors.",
          features: [
            "Advanced Mineralogical Testing & Assay Laboratories",
            "Pilot-Scale Beneficiation & Processing Facilities",
            "Engineering Consultancy & Productivity Diagnostics",
            "Specialized Technical Workforce & ASM Development",
          ],
        },
      ]),
      business_categories: JSON.stringify([
        {
          icon: "Pickaxe",
          title: "Metallic & Energy Minerals",
          growth: "Strategic Focus",
          description: "Iron ore, copper, gold, tantalum, lithium, and coal beneficiation for domestic smelting and industrial energy.",
          topFocus: ["Direct Reduced Iron (DRI)", "Base Metal Smelting", "Coal Washing & Grading"],
        },
        {
          icon: "Building2",
          title: "Construction & Industrial Minerals",
          growth: "High Demand",
          description: "Limestone, gypsum, clay, silica sand, and dimensional stone supplying cement, glass, and ceramic manufacturing.",
          topFocus: ["Cement Clinker Optimization", "Ceramic Formulation", "Dimension Stone Dressing"],
        },
        {
          icon: "Sparkles",
          title: "Gemstones & Jewelry Industry",
          growth: "Value Addition",
          description: "Opal, emerald, sapphire, and quartz lapidary, certification, and modern jewelry production.",
          topFocus: ["Lapidary Training", "Standardized Valuation", "Export Quality Verification"],
        },
        {
          icon: "FlaskConical",
          title: "Agro-Minerals & Fertilizers",
          growth: "Import Substitution",
          description: "Phosphate, potash, lime, and dolomite processing to supply agricultural soil conditioners and fertilizer blending.",
          topFocus: ["Agricultural Lime Production", "Phosphate Beneficiation", "Soil Conditioning"],
        },
      ]),
      key_metrics: JSON.stringify([
        {
          title: "Beneficiation Focus",
          value: "4 Priority",
          change: "Value Chains",
          period: "Metallic, Non-Metallic, Stones, Agro",
          icon: "Layers",
          color: "from-blue-600 to-cyan-600",
        },
        {
          title: "Technical Support",
          value: "Consultancy",
          change: "Diagnostics",
          period: "Process Optimization & Testing",
          icon: "FlaskConical",
          color: "from-emerald-600 to-green-600",
        },
        {
          title: "Human Capital",
          value: "Capacity",
          change: "Training",
          period: "Specialized Sectoral Engineers",
          icon: "GraduationCap",
          color: "from-amber-600 to-orange-600",
        },
        {
          title: "Industry Integration",
          value: "Import Sub",
          change: "Linkages",
          period: "Domestic Manufacturing Supply",
          icon: "Factory",
          color: "from-purple-600 to-indigo-600",
        },
      ]),
      operations_data: JSON.stringify([
        {
          area: "Mineral Characterization & Assay",
          focus: "XRF, XRD & Ore Testing",
          infrastructure: "Central Laboratories",
          status: "Operational",
        },
        {
          area: "Process Engineering & Pilot Plants",
          focus: "Beneficiation Flowsheet Design",
          infrastructure: "Pilot Testing Units",
          status: "Operational",
        },
        {
          area: "Industrial Diagnostics & Consultancy",
          focus: "Factory Efficiency & Troubleshooting",
          infrastructure: "On-Site Technical Teams",
          status: "Active",
        },
        {
          area: "Workforce & ASM Skill Development",
          focus: "Lapidary, Mineral Dressing, Metallurgy",
          infrastructure: "Training Workshops",
          status: "Continuous",
        },
      ]),
      quick_stats: JSON.stringify({
        left: [
          { label: "Core Mandate", value: "Industrial Mineral Value Addition" },
          { label: "Regulatory Basis", value: "Proclamation 1263/2014 & Reg 508/2022" },
        ],
        right: [
          { label: "Focus Sectors", value: "Cement, Ceramics, Glass, Metals, Gemstones" },
          { label: "Primary Objective", value: "Import Substitution & Resource Optimization" },
        ],
      }),
      network_operations: JSON.stringify([
        {
          title: "Applied R&D",
          description: "Ore dressing, metallurgical tests, and pilot-scale process verification.",
          full_description:
            "Conducting applied research and pilot trials to establish viable beneficiation routes for domestic mineral occurrences.",
          icon: "FlaskConical",
        },
        {
          title: "Technology Transfer",
          description: "Introducing modern mining and processing machinery and sustainable methods.",
          full_description:
            "Supporting local manufacturing industries to adapt cutting-edge mineral processing, casting, and finishing technologies.",
          icon: "Cpu",
        },
        {
          title: "Industrial Standards & Testing",
          description: "Chemical composition, mechanical strength, and mineralogical identification.",
          full_description:
            "Providing verifiable analytical data for mineral producers, processors, and industrial end-users.",
          icon: "Award",
        },
        {
          title: "Value Chain Linkages",
          description: "Bridging extraction with domestic industrial manufacturing plants.",
          full_description:
            "Fostering formal linkages between mineral extraction enterprises and downstream domestic consumers to replace imports.",
          icon: "Share2",
        },
      ]),
      page_metadata: JSON.stringify({
        hero_section: {
          title: "Mineral Industry Development & Technical Framework",
          description:
            "Explore the strategic mineral value chain, priority processing sub-sectors, and institutional technical capabilities supporting industrial transformation in Ethiopia.",
          bg_image: "",
        },
        key_metrics_info: {
          title: "Strategic Institutional Pillars",
          description: "Core developmental dimensions guiding MIDI's mineral industry initiatives.",
        },
        key_verticals_info: { title: "Priority Mineral Sub-Sectors", icon: "Layers" },
        operations_table_info: {
          title: "Institutional Technical Capabilities",
          description: "Key operational divisions and specialized engineering services provided to the industry.",
          icon: "Wrench",
        },
        network_operations_info: {
          title: "Development Programs",
          description: "Systemic initiatives driving technology transfer, quality assurance, and value chain integration.",
        },
      }),
      updated_at: now,
    };

    if (existingOverviews.length > 0) {
      await queryInterface.bulkUpdate(
        "business_overview",
        institutionalData,
        { business_overview_id: existingOverviews[0].business_overview_id }
      );
    } else {
      await queryInterface.bulkInsert("business_overview", [
        {
          business_overview_id: uuidv4(),
          ...institutionalData,
          created_at: now,
        },
      ]);
    }

    // 2. Seed the 5 Mineral Value Chain Nodes
    const nodes = [
      {
        business_node_id: "50000000-0000-4000-8000-000000000001",
        id_string: "extraction-prospecting",
        title: "Mineral Extraction & Mining",
        title_am: "የማዕድን ቁፋሮ እና ማውጣት",
        description:
          "Sustainable extraction and artisanal & industrial mining practices providing quality raw mineral feedstocks.",
        description_am:
          "ጥራት ያለው የጥሬ ማዕድን አቅርቦት የሚያረጋግጡ ዘላቂ የቁፋሮ እና የአነስተኛና ከፍተኛ ደረጃ የማዕድን ማውጣት ተግባራት።",
        icon: "Pickaxe",
        position_x: 12,
        position_y: 50,
        mobile_order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        business_node_id: "50000000-0000-4000-8000-000000000002",
        id_string: "beneficiation-processing",
        title: "Beneficiation & Mineral Dressing",
        title_am: "ማዕድናትን ማበልፀግ እና ማጣራት",
        description:
          "Crushing, grinding, flotation, and magnetic separation to upgrade ore grades and concentrate valuable minerals.",
        description_am:
          "የማዕድን ይዘትን ለማሳደግ እና ጠቃሚ ንጥረ ነገሮችን ለመለየት የሚከናወን የመፍጨት፣ የማጣራት እና የፍሎቴሽን ቴክኒካዊ ሂደት።",
        icon: "Layers",
        position_x: 31,
        position_y: 30,
        mobile_order: 2,
        created_at: now,
        updated_at: now,
      },
      {
        business_node_id: "50000000-0000-4000-8000-000000000003",
        id_string: "metallurgy-refining",
        title: "Metallurgy & Primary Refining",
        title_am: "ብረታብረትና የመጀመሪያ ደረጃ ማጣራት",
        description:
          "Smelting, hydrometallurgy, pyrometallurgy, and foundry operations converting concentrates into base metals, alloys, and refined compounds.",
        description_am:
          "ማዕድናትን ወደ ጥሬ ብረታብረት፣ ቅይጥ እና ንጹሕ ውህዶች የሚቀይሩ የማቅለጥ፣ የውሃ እና የእሳት ኬሚካል ማጣሪያ ስራዎች።",
        icon: "Flame",
        position_x: 50,
        position_y: 70,
        mobile_order: 3,
        created_at: now,
        updated_at: now,
      },
      {
        business_node_id: "50000000-0000-4000-8000-000000000004",
        id_string: "industrial-manufacturing",
        title: "Value-Added Manufacturing",
        title_am: "እሴት የተጨመረበት ማኑፋክቸሪንግ",
        description:
          "Transformation into cement, advanced ceramics, flat & container glass, cut gemstones, fertilizers, and structural steel.",
        description_am:
          "ማዕድናትን ወደ ሲሚንቶ፣ ሴራሚክስ፣ መስታወት፣ የተወለወሉ የከበሩ ድንጋዮች፣ ማዳበሪያዎች እና መዋቅራዊ ብረታብረት መቀየር።",
        icon: "Factory",
        position_x: 69,
        position_y: 30,
        mobile_order: 4,
        created_at: now,
        updated_at: now,
      },
      {
        business_node_id: "50000000-0000-4000-8000-000000000005",
        id_string: "market-integration",
        title: "Industrial & Construction End Markets",
        title_am: "የኢንዱስትሪ እና የግንባታ ገበያዎች",
        description:
          "Import substitution and domestic industrial integration supporting infrastructure, agriculture, and high-tech sectors.",
        description_am:
          "የሀገር ውስጥ መሠረተ ልማትን፣ ግብርናን እና ቴክኖሎጂን በመደገፍ የውጭ ምንዛሬን የሚያድኑ የኢንዱስትሪ ምርቶች ስርጭት።",
        icon: "Building2",
        position_x: 88,
        position_y: 50,
        mobile_order: 5,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const node of nodes) {
      const existing = await queryInterface.sequelize.query(
        `SELECT business_node_id FROM business_nodes WHERE id_string = '${node.id_string}' LIMIT 1;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      if (existing.length > 0) {
        await queryInterface.bulkUpdate("business_nodes", node, {
          business_node_id: existing[0].business_node_id,
        });
      } else {
        await queryInterface.bulkInsert("business_nodes", [node]);
      }
    }

    // 3. Update routes and route_translations
    // Update /mineral-industry-development route label
    await queryInterface.sequelize.query(`
      UPDATE route_translations
      SET label = 'Mineral Industry Development', updated_at = NOW()
      WHERE route_id IN (SELECT route_id FROM routes WHERE path = '/mineral-industry-development')
        AND language_code = 'en';
    `);

    await queryInterface.sequelize.query(`
      UPDATE route_translations
      SET label = 'የማዕድን ኢንዱስትሪ ልማት', updated_at = NOW()
      WHERE route_id IN (SELECT route_id FROM routes WHERE path = '/mineral-industry-development')
        AND language_code = 'am';
    `);

    // Update /mineral-industry-development/overview route label
    await queryInterface.sequelize.query(`
      UPDATE route_translations
      SET label = 'Sector Overview', updated_at = NOW()
      WHERE route_id IN (SELECT route_id FROM routes WHERE path = '/mineral-industry-development/overview')
        AND language_code = 'en';
    `);

    await queryInterface.sequelize.query(`
      UPDATE route_translations
      SET label = 'የዘርፉ አጠቃላይ እይታ', updated_at = NOW()
      WHERE route_id IN (SELECT route_id FROM routes WHERE path = '/mineral-industry-development/overview')
        AND language_code = 'am';
    `);

    // Remove retired subroutes and their translations
    await queryInterface.sequelize.query(`
      DELETE FROM route_translations
      WHERE route_id IN (
        SELECT route_id FROM routes
        WHERE path IN ('/businesses/trading', '/businesses/import-export', '/businesses/warehousing')
      );
    `);
    await queryInterface.sequelize.query(`
      DELETE FROM routes
      WHERE path IN ('/businesses/trading', '/businesses/import-export', '/businesses/warehousing');
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("business_nodes", {
      id_string: [
        "extraction-prospecting",
        "beneficiation-processing",
        "metallurgy-refining",
        "industrial-manufacturing",
        "market-integration",
      ],
    });
  },
};
