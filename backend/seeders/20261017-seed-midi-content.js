"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Sliders
    const sliders = [
      {
        slider_id: "10000000-0000-4000-8000-000000000001",
        title: "Mineral Industry Development Institute (MIDI)",
        description: "Spearheading research, technology transfer, and high-level human resource development to accelerate production, import substitution, and sustainable development of Ethiopia's mineral industry.",
        order: 1,
        button_name: "Explore Sectors",
        button_url: "/businesses",
        button2_name: "About MIDI",
        button2_url: "/about",
        attachment_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        slider_id: "10000000-0000-4000-8000-000000000002",
        title: "Advanced Training & Workshop Facilities",
        description: "Establishing state-of-the-art Center of Excellence workshops, material testing laboratories, and technical training centers across Addis Ababa and mining regions.",
        order: 2,
        button_name: "Our Facilities",
        button_url: "/facilities",
        button2_name: "Our Services",
        button2_url: "/services",
        attachment_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        slider_id: "10000000-0000-4000-8000-000000000003",
        title: "Catalyzing Strategic Mineral Value Chains",
        description: "Providing technical consultancy and productivity enhancement across metallic minerals, fertilizers, cement, ceramics, glass, dimensional stone, and gemstones.",
        order: 3,
        button_name: "Our Services",
        button_url: "/services",
        button2_name: "Contact Us",
        button2_url: "/contact",
        attachment_id: null,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("sliders", sliders, { ignoreDuplicates: true });

    // 2. Purpose
    const pillars = JSON.stringify([
      {
        title: "R&D & Technology Transfer",
        description: "Establishing testing laboratories, foundry workshops, and specialized mold/casting facilities to drive sectorial innovation.",
        icon: "FlaskConical",
      },
      {
        title: "Human Capital Development",
        description: "Developing over 520 specialized professionals in mining engineering, mineral processing, metallurgy, and economics.",
        icon: "GraduationCap",
      },
      {
        title: "Production & Productivity",
        description: "Overcoming industrial efficiency constraints across cement, ceramics, glass, dimensional stone, and metallurgy.",
        icon: "TrendingUp",
      },
      {
        title: "Investment Promotion & ASM",
        description: "Preparing pre-feasibility studies, industrial profiles, and technical assistance for investors and Artisanal & Small-Scale Miners.",
        icon: "Compass",
      },
    ]);

    await queryInterface.bulkInsert(
      "purposes",
      [
        {
          purpose_id: "20000000-0000-4000-8000-000000000001",
          subtitle: "Federal Democratic Republic of Ethiopia — Ministry of Mines",
          title: "Transforming the Mineral Industry Through Innovation & Capacity",
          description: "Established under Proclamation No. 1263/2014 and Regulation No. 508/2022, the Mineral Industry Development Institute (MIDI) is mandated to support the national mineral industry in applied research & development, technical consultancy, modern laboratory testing, and human capital development to foster production, import substitution, and sustainable development.",
          quote: "Empowering Ethiopia's mineral potential through industry-driven professionals, state-of-the-art workshop facilities, and high-impact technology transfer.",
          pillars: pillars,
          attachment_id: null,
          created_at: now,
          updated_at: now,
        },
      ],
      { ignoreDuplicates: true }
    );

    // 3. Cards
    await queryInterface.bulkInsert(
      "cards",
      [
        {
          card_id: "30000000-0000-4000-8000-000000000001",
          title: "Advancing Ethiopia's Strategic Mineral Industries",
          description: "The Mineral Industry Development Institute (MIDI) bridges the gap between raw mineral resources and industrial manufacturing through technical consultancy, laboratory testing, specialized training centers of excellence, and domestic and foreign investment facilitation.",
          button_name: "Explore Our Services",
          button_url: "/services",
          attachment_id: null,
          created_at: now,
          updated_at: now,
        },
      ],
      { ignoreDuplicates: true }
    );

    // 4. Backgrounds
    await queryInterface.bulkInsert(
      "backgrounds",
      [
        {
          background_id: "40000000-0000-4000-8000-000000000001",
          title: "Mineral Industry Development Institute (MIDI)",
          description: "Established under Proclamation No. 1263/2014 and Regulation No. 508/2022 to support Ethiopia's mineral industry in applied R&D, technical consultancy, and human capital development.",
          icon: "Building2",
          content: "Established under Proclamation No. 1263/2014 and governed by Regulation No. 508/2022 under the Ministry of Mines, the Mineral Industry Development Institute (MIDI) is mandated to support the national mineral industry in applied research & development, technical consultancy, modern laboratory testing, and specialized human capital development to foster production, import substitution, and sustainable economic transformation across the cement, ceramic, glass, dimensional stone, and metal sectors.",
        },
      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sliders", null, {});
    await queryInterface.bulkDelete("purposes", null, {});
    await queryInterface.bulkDelete("cards", null, {});
    await queryInterface.bulkDelete("backgrounds", null, {});
  },
};
