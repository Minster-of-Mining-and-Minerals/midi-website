/** Static SEO copy keyed by public path (without locale prefix). */
export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  "/": {
    title: "MIDI - Mineral Industry Development Institute",
    description:
      "Official portal of the Mineral Industry Development Institute (MIDI), Ministry of Mines, Ethiopia. Driving research, technical capacity, and sustainable mineral industrialization.",
  },
  "/about": {
    title: "About MIDI",
    description:
      "Learn about MIDI's mandate under Proclamation No. 1263/2014 & Regulation No. 508/2022, leadership, research mission, vision, and strategic goals.",
  },
  "/services": {
    title: "Our Services & Technical Support",
    description:
      "Comprehensive laboratory testing, technical consultancy, feasibility studies, and capacity building for the Ethiopian mineral industry.",
  },
  "/publications": {
    title: "Publications & Research | MIDI",
    description:
      "Explore official research reports, mineral maps, technical manuals, and institutional publications by the Mineral Industry Development Institute (MIDI), Ethiopia.",
  },
  "/products": {
    title: "Strategic Mineral Sectors",
    description:
      "Explore Ethiopia's mineral potential across metallic, energy, agro-minerals, cement, ceramics, glass, dimensional stones, and gemstones.",
  },
  "/facilities": {
    title: "Facilities & Centers of Excellence",
    description:
      "Advanced mineral industry workshops, training centers, material testing laboratories, and tool rooms across Ethiopia.",
  },
  "/careers": {
    title: "Careers & Opportunities",
    description:
      "Join the Mineral Industry Development Institute (MIDI) and contribute to national industrial growth and research excellence.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Contact the Mineral Industry Development Institute (MIDI). Office locations, inquiries, and technical consultation.",
  },
  "/businesses": {
    title: "Mineral Industry Development | MIDI",
    description:
      "Explore Ethiopia's mineral value chain, processing, beneficiation, and industrial manufacturing integration supported by MIDI.",
  },
  "/businesses/overview": {
    title: "Development Overview & Technical Framework | MIDI",
    description:
      "Institutional framework, priority mineral sub-sectors, laboratory testing, and development programs of the Mineral Industry Development Institute.",
  },
  "/businesses/mineral-processing": {
    title: "Mineral Processing & Beneficiation | MIDI",
    description:
      "Ore characterization, comminution, gravity concentration, froth flotation, and recovery optimization for Ethiopian mineral resources.",
  },
  "/businesses/value-addition": {
    title: "Mineral-Based Manufacturing & Value Addition | MIDI",
    description:
      "Transforming domestic mineral feedstocks into cement, structural ceramics, glass, foundries, and lapidary products.",
  },
  "/businesses/research-innovation": {
    title: "Applied Research, Technology Transfer & Innovation | MIDI",
    description:
      "Bench-scale testing, pilot trials, metallurgical solutions, and technical knowledge dissemination under the Mineral Industry Development Institute.",
  },
  "/businesses/import-export": {
    title: "Mineral Industry Development | MIDI",
    description:
      "Mineral processing, beneficiation, and domestic value addition under the Mineral Industry Development Institute.",
  },
  "/businesses/trading": {
    title: "Mineral Industry Development | MIDI",
    description:
      "Mineral value chains and industrial transformation supported by the Mineral Industry Development Institute.",
  },
  "/businesses/warehousing": {
    title: "Facilities & Laboratories | MIDI",
    description:
      "Advanced testing laboratories, pilot plants, and workshop facilities of the Mineral Industry Development Institute.",
  },
  "/news": {
    title: "News & Publications",
    description:
      "Stay updated with the latest news, announcements, research publications, and events from MIDI.",
  },
  "/_midi": {
    title: "MIDI Facility & Human Resource Development Project",
    description:
      "The 5-year National Flagship Project to establish training centers, workshops, and build 520+ industry-driven professionals.",
  },
};

export function getPageSeo(path: string) {
  return PAGE_SEO[path] ?? null;
}
