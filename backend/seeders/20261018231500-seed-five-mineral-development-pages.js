"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Baseline Content for 5 Institutional Pages
    const pages = [
      {
        business_page_id: "60000000-0000-4000-8000-000000000001",
        slug: "landing",
        title: "Mineral Industry Development",
        title_am: "የማዕድን ኢንዱስትሪ ልማት",
        subtitle: "Catalyzing Ethiopia's Mineral Value Chains & Industrial Transformation",
        subtitle_am: "የኢትዮጵያን የማዕድን እሴት ሰንሰለት እና የኢንዱስትሪ ሽግግር ማፋጠን",
        summary:
          "Spearheading sustainable mineral industry development across Ethiopia through applied research, technical consultancy, high-level capacity building, and specialized laboratory testing.",
        summary_am:
          "በተግባራዊ ምርምር፣ በቴክኒክ ማማከር፣ በከፍተኛ ደረጃ አቅም ግንባታ እና በልዩ የላቦራቶሪ ምርመራ አማካኝነት በመላው ኢትዮጵያ ዘላቂ የማዕድን ኢንዱስትሪ ልማትን መምራት።",
        content:
          "Established under Proclamation No. 1263/2014 and Regulation No. 508/2022 under the Ministry of Mines, the Mineral Industry Development Institute (MIDI) is the mandated government body driving technical advancement, value addition, and domestic manufacturing integration across Ethiopia's mineral sector.",
        content_am:
          "በአዋጅ ቁጥር 1263/2014 እና ደንብ ቁጥር 508/2022 በማዕድን ሚኒስቴር ስር የተቋቋመው የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI) በኢትዮጵያ የማዕድን ዘርፍ የቴክኒክ እድገትን፣ የእሴት ጭማሪን እና የሀገር ውስጥ ማኑፋክቸሪንግ ውህደትን የሚመራ የመንግስት ተቋም ነው።",
        sections_data: JSON.stringify({
          hero_badge: "Government Institute — Ministry of Mines",
          hero_badge_am: "የመንግስት ተቋም — የማዕድን ሚኒስቴር",
        }),
        publish_status: "published",
        display_order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        business_page_id: "60000000-0000-4000-8000-000000000002",
        slug: "overview",
        title: "Development Overview",
        title_am: "የልማት አጠቃላይ እይታ",
        subtitle: "Institutional Technical Framework Across Strategic Mineral Commodities",
        subtitle_am: "በስልታዊ የማዕድን ምርቶች ላይ የተዘረጋ ተቋማዊ የቴክኒክ ድጋፍ ማዕቀፍ",
        summary:
          "An overarching view of MIDI's mandated role, technical focus areas, and specialized industrial engineering capabilities supporting national self-reliance.",
        summary_am:
          "የተቋሙን ስልጣንና ተግባር፣ ቀዳሚ የቴክኒክ ትኩረት መስኮችን እና የሀገር ውስጥ ራስን መቻልን የሚደግፉ ልዩ የኢንዱስትሪ ምህንድስና አቅሞችን የሚያሳይ አጠቃላይ እይታ።",
        content:
          "MIDI operates as a single specialized institute within the Ministry of Mines, delivering technical diagnostics, flowsheet design, laboratory assays, and human resource development across four priority mineral commodity groupings.",
        content_am:
          "ተቋሙ በማዕድን ሚኒስቴር ስር የሚሰራ ልዩ ተቋም ሲሆን፣ በአራት ቀዳሚ የማዕድን ዘርፎች ላይ የቴክኒክ ምርመራዎችን፣ የሂደት ንድፎችን፣ የላቦራቶሪ ትንተናዎችን እና የሰው ኃይል ልማትን ያከናውናል።",
        sections_data: JSON.stringify({
          priority_areas: [
            "Metallic & Energy Minerals",
            "Construction & Industrial Minerals",
            "Gemstones & Jewelry",
            "Agro-Minerals & Soil Conditioners",
          ],
        }),
        publish_status: "published",
        display_order: 2,
        created_at: now,
        updated_at: now,
      },
      {
        business_page_id: "60000000-0000-4000-8000-000000000003",
        slug: "mineral-processing",
        title: "Mineral Processing & Beneficiation",
        title_am: "የማዕድን ማቀነባበሪያ እና ማበልፀጊያ",
        subtitle: "Upgrading Raw Ore Grades Through Advanced Dressing & Separation Technologies",
        subtitle_am: "የላቁ የማጣሪያ እና የመለያ ቴክኖሎጂዎችን በመጠቀም የጥሬ ማዕድናት ይዘትን ማሳደግ",
        summary:
          "Ore characterization, comminution, gravity concentration, froth flotation, and magnetic separation designed to maximize valuable mineral recoveries and concentrate purity.",
        summary_am:
          "ጠቃሚ የሆኑ ማዕድናትን ይዘት ለማሳደግ እና የክምችቱን ንፅህና ለመጨመር የሚከናወኑ የኦር ባህሪ ጥናት፣ የመፍጨት፣ የስበት መለያየት፣ የፍሎቴሽን እና መግነጢሳዊ የማጣሪያ ሂደቶች።",
        content:
          "Beneficiation is the vital intermediary stage between extraction and manufacturing. MIDI supports domestic producers in characterizing ore mineralogy, testing physical separation flowsheets, and optimizing plant recovery parameters to produce furnace-ready and factory-grade feedstocks.",
        content_am:
          "ማዕድናትን ማበልፀግ በማውጣት እና በማኑፋክቸሪንግ መካከል የሚገኝ ወሳኝ የሽግግር ደረጃ ነው። ተቋሙ የሀገር ውስጥ አምራቾች የማዕድናትን ባህሪ እንዲረዱ፣ አካላዊ የመለያ ቴክኒኮችን እንዲሞክሩ እና ለፋብሪካ ግብዓት የሚሆኑ ንፁህ ምርቶችን እንዲያዘጋጁ የቴክኒክ ድጋፍ ይሰጣል።",
        sections_data: JSON.stringify({
          methods: [
            {
              title: "Comminution & Sizing",
              title_am: "መፍጨት እና መጠን መለየት",
              description:
                "Jaw crushers, cone crushers, ball mills, and hydrocyclones providing optimal mineral liberation grain sizes.",
              title_am_desc: "ማዕድናትን በሚገባ ለመለየት የሚያስችሉ የመፍጫ፣ የደቃቃ እና የክፍፍል መሳሪያዎች እና ሂደቶች።",
            },
            {
              title: "Froth Flotation",
              title_am: "የፍሎቴሽን (አረፋ) መለያየት",
              description:
                "Chemical reagent conditioning and bubble attachment separating hydrophobic sulfide and oxide mineral concentrates.",
              title_am_desc: "በኬሚካል ግብዓቶች አማካኝነት ጠቃሚ የሰልፋይድ እና ኦክሳይድ ማዕድናትን በአረፋ ለይቶ የማውጣት ሂደት።",
            },
            {
              title: "Magnetic & Gravity Separation",
              title_am: "መግነጢሳዊ እና የስበት መለያየት",
              description:
                "Utilizing density differentials (shaking tables, spirals) and magnetic susceptibility to concentrate heavy minerals.",
              title_am_desc: "የክብደት ልዩነትን እና መግነጢሳዊ ስበትን በመጠቀም ከባድና ጠቃሚ ማዕድናትን ከአሸዋና ቆሻሻ የመለየት ዘዴ።",
            },
            {
              title: "Hydrometallurgical Leaching",
              title_am: "የሃይድሮ-ሜታለርጂ ኬሚካል ማጣሪያ",
              description:
                "Aqueous chemical extraction, agitation leaching, and solvent extraction for base and precious metal recovery.",
              title_am_desc: "የውሃና ኬሚካል ውህዶችን በመጠቀም ውድና መሰረታዊ ብረታብረቶችን በፈሳሽ መልክ አሟምቶ የመለየት ሂደት።",
            },
          ],
        }),
        publish_status: "published",
        display_order: 3,
        created_at: now,
        updated_at: now,
      },
      {
        business_page_id: "60000000-0000-4000-8000-000000000004",
        slug: "value-addition",
        title: "Mineral-Based Manufacturing & Value Addition",
        title_am: "እሴት መጨመር እና ማኑፋክቸሪንግ",
        subtitle: "Transforming Domestic Mineral Feedstocks into Finished Industrial Products",
        subtitle_am: "የሀገር ውስጥ የጥሬ ማዕድን ግብዓቶችን ወደ ተጠናቀቁ የኢንዱስትሪ ምርቶች መቀየር",
        summary:
          "Bridging the gap between extraction and domestic manufacturing through cement clinker optimization, architectural ceramics, container glass, metallurgical foundries, and lapidary.",
        summary_am:
          "የሲሚንቶ ክሊንከርን በማሻሻል፣ በሴራሚክስ፣ በመስታወት፣ በብረታብረት ማቅለጥ እና በከበሩ ድንጋዮች አጨራረስ አማካኝነት በማዕድን ማውጣት እና በሀገር ውስጥ ማኑፋክቸሪንግ መካከል ያለውን ክፍተት ማገናኘት።",
        content:
          "Value addition is the central policy driver of Ethiopia's mineral strategy. By transitioning from exporting unrefined minerals to domestic processing, the nation retains economic value, creates skilled manufacturing employment, and substitutes critical industrial imports.",
        content_am:
          "እሴት መጨመር የኢትዮጵያ የማዕድን ስትራቴጂ ዋና ምሰሶ ነው። ጥሬ ማዕድንን ያለ እሴት ጭማሪ ከመላክ ይልቅ በሀገር ውስጥ በማቀነባበር፣ ከፍተኛ ኢኮኖሚያዊ ጥቅም ማስገኘት፣ የስራ ዕድል መፍጠር እና የውጭ ምርቶችን በሀገር ውስጥ መተካት ይቻላል።",
        sections_data: JSON.stringify({
          sectors: [
            {
              name: "Cement & Construction Binders",
              name_am: "ሲሚንቶ እና የግንባታ ማጣበቂያዎች",
              materials: "Limestone, Gypsum, Clay, Pozzolana, Pumice",
              materials_am: "የኖራ ድንጋይ፣ ጂፕሰም፣ ሸክላ፣ ፖዞላና",
            },
            {
              name: "Ceramics & Structural Clay",
              name_am: "ሴራሚክስ እና የመዋቅር ሸክላ ምርቶች",
              materials: "Kaolin, Feldspar, Quartz, Ball Clay",
              materials_am: "ካኦሊን፣ ፌልድስፓር፣ ኳርትዝ፣ ሸክላ",
            },
            {
              name: "Flat & Container Glass",
              name_am: "ጠፍጣፋ እና የጠርሙስ መስታወት",
              materials: "Silica Sand, Dolomite, Soda Ash, Limestone",
              materials_am: "የሲሊካ አሸዋ፣ ዶሎማይት፣ ሶዳ አሽ፣ የኖራ ድንጋይ",
            },
            {
              name: "Foundry & Base Metal Smelting",
              name_am: "የብረታብረት ማቅለጥ እና ቀረጣ",
              materials: "Iron Ore, Scrap Steel, Ferroalloys, Foundry Sand",
              materials_am: "የብረት ማዕድን፣ ቁራጭ ብረት፣ ቅይጥ ብረቶች፣ የቀረጣ አሸዋ",
            },
            {
              name: "Gemstone Lapidary & Jewelry",
              name_am: "የከበሩ ድንጋዮች ጌጣጌጥ እና አጨራረስ",
              materials: "Opal, Emerald, Sapphire, Ruby, Quartz",
              materials_am: "ኦፓል፣ መረግድ፣ ሳፋየር፣ ሩቢ፣ ኳርትዝ",
            },
          ],
        }),
        publish_status: "published",
        display_order: 4,
        created_at: now,
        updated_at: now,
      },
      {
        business_page_id: "60000000-0000-4000-8000-000000000005",
        slug: "research-innovation",
        title: "Applied Research, Technology Transfer & Innovation",
        title_am: "ተግባራዊ ምርምር እና ቴክኖሎጂ ሽግግር",
        subtitle: "Industry-Driven R&D, Pilot Flowsheet Evaluation, and Technical Capacity Building",
        subtitle_am: "ኢንዱስትሪ-መር ምርምር፣ የሙከራ ፍሰት-ንድፍ ግምገማ እና የቴክኒክ አቅም ግንባታ",
        summary:
          "Conducting applied laboratory evaluations, adapting cutting-edge processing technologies, solving industrial production bottlenecks, and publishing verified mineral technical studies.",
        summary_am:
          "ተግባራዊ የላቦራቶሪ ግምገማዎችን ማካሄድ፣ ዘመናዊ የማቀነባበሪያ ቴክኖሎጂዎችን ማላመድ፣ የኢንዱስትሪ ምርት ማነቆዎችን መፍታት እና የተረጋገጡ ቴክኒካዊ ጥናቶችን ማሳተም።",
        content:
          "Applied research at MIDI bridges academic geological findings and actual industrial production. Through bench-scale testing, pilot trials, and technical documentation, the institute develops practical solutions that reduce production costs and improve environmental performance.",
        content_am:
          "በተቋሙ የሚካሄዱ ተግባራዊ ምርምሮች የጂኦሎጂካል ግኝቶችን እና ትክክለኛ የኢንዱስትሪ ምርትን ያገናኛሉ። በላቦራቶሪ ሙከራዎች፣ በሙከራ ጣቢያዎች እና በቴክኒካዊ ሰነዶች አማካኝነት ተቋሙ የምርት ወጪን የሚቀንሱ እና የአካባቢ ጥበቃን የሚያሻሽሉ ተግባራዊ መፍትሄዎችን ያዘጋጃል።",
        sections_data: JSON.stringify({
          pipeline_steps: [
            {
              step: 1,
              title: "Laboratory Ore Characterization",
              title_am: "የላቦራቶሪ የማዕድን ባህሪ ጥናት",
            },
            {
              step: 2,
              title: "Bench & Pilot Scale Flowsheet Trials",
              title_am: "የሙከራ ደረጃ የሂደት ፍሰት ሙከራዎች",
            },
            {
              step: 3,
              title: "Industrial Plant Adaptation & Transfer",
              title_am: "የኢንዱስትሪ ፋብሪካ ቴክኖሎጂ ሽግግር",
            },
            {
              step: 4,
              title: "Publication & Sectoral Knowledge Sharing",
              title_am: "ህትመት እና የዘርፍ እውቀት ስርጭት",
            },
          ],
        }),
        publish_status: "published",
        display_order: 5,
        created_at: now,
        updated_at: now,
      },
    ];

    // Seed or update business_pages
    for (const page of pages) {
      const existing = await queryInterface.sequelize.query(
        `SELECT business_page_id FROM business_pages WHERE slug = '${page.slug}' LIMIT 1;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      if (existing.length > 0) {
        await queryInterface.bulkUpdate("business_pages", page, {
          business_page_id: existing[0].business_page_id,
        });
      } else {
        await queryInterface.bulkInsert("business_pages", [page]);
      }
    }

    // 2. Synchronize Routes and RouteTranslations in Database
    const parentRouteQuery = await queryInterface.sequelize.query(
      `SELECT route_id FROM routes WHERE path = '/businesses' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (parentRouteQuery.length > 0) {
      const parentRouteId = parentRouteQuery[0].route_id;

      // Update parent route label
      await queryInterface.sequelize.query(`
        UPDATE route_translations
        SET label = 'Mineral Industry Development', updated_at = NOW()
        WHERE route_id = '${parentRouteId}' AND language_code = 'en';
      `);
      await queryInterface.sequelize.query(`
        UPDATE route_translations
        SET label = 'የማዕድን ኢንዱስትሪ ልማት', updated_at = NOW()
        WHERE route_id = '${parentRouteId}' AND language_code = 'am';
      `);

      // Define the 4 subroutes under /businesses
      const subroutes = [
        {
          path: "/businesses/overview",
          order: 1,
          en: "Development Overview",
          am: "የልማት አጠቃላይ እይታ",
        },
        {
          path: "/businesses/mineral-processing",
          order: 2,
          en: "Mineral Processing",
          am: "የማዕድን ማቀነባበሪያ",
        },
        {
          path: "/businesses/value-addition",
          order: 3,
          en: "Value Addition",
          am: "እሴት መጨመር",
        },
        {
          path: "/businesses/research-innovation",
          order: 4,
          en: "Research & Innovation",
          am: "ተግባራዊ ምርምር እና ቴክኖሎጂ",
        },
      ];

      for (const sub of subroutes) {
        const existingRoute = await queryInterface.sequelize.query(
          `SELECT route_id FROM routes WHERE path = '${sub.path}' LIMIT 1;`,
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        let subRouteId;
        if (existingRoute.length > 0) {
          subRouteId = existingRoute[0].route_id;
          await queryInterface.sequelize.query(`
            UPDATE routes
            SET parent_id = '${parentRouteId}', "order" = ${sub.order}, is_active = true, show_in_navbar = true, updated_at = NOW()
            WHERE route_id = '${subRouteId}';
          `);
        } else {
          subRouteId = uuidv4();
          await queryInterface.bulkInsert("routes", [
            {
              route_id: subRouteId,
              path: sub.path,
              parent_id: parentRouteId,
              order: sub.order,
              is_active: true,
              show_in_navbar: true,
              created_at: now,
              updated_at: now,
            },
          ]);
        }

        // Update or insert translations
        for (const lang of ["en", "am"]) {
          const label = lang === "en" ? sub.en : sub.am;
          const existingTrans = await queryInterface.sequelize.query(
            `SELECT route_translation_id FROM route_translations WHERE route_id = '${subRouteId}' AND language_code = '${lang}' LIMIT 1;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );

          if (existingTrans.length > 0) {
            await queryInterface.sequelize.query(`
              UPDATE route_translations
              SET label = '${label}', updated_at = NOW()
              WHERE route_translation_id = '${existingTrans[0].route_translation_id}';
            `);
          } else {
            await queryInterface.bulkInsert("route_translations", [
              {
                route_translation_id: uuidv4(),
                route_id: subRouteId,
                language_code: lang,
                label: label,
                created_at: now,
                updated_at: now,
              },
            ]);
          }
        }
      }

      // Ensure retired subroutes remain hidden from navbar
      await queryInterface.sequelize.query(`
        UPDATE routes
        SET show_in_navbar = false, updated_at = NOW()
        WHERE path IN ('/businesses/trading', '/businesses/import-export', '/businesses/warehousing');
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("business_pages", null, {});
  },
};
