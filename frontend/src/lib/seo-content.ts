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
    title: "Mineral Sectors & Industrial Divisions",
    description:
      "Discover the strategic commodity divisions supported by MIDI across Ethiopia's mineral value chain.",
  },
  "/businesses/overview": {
    title: "Mineral Industry Overview",
    description:
      "An overview of Ethiopia's mineral sectors, productivity goals, and industrial development priorities.",
  },
  "/businesses/import-export": {
    title: "Import Substitution & Export Development",
    description:
      "Strategic initiatives by MIDI to expand mineral export revenues and substitute industrial imports.",
  },
  "/businesses/trading": {
    title: "Commodity Trading & Market Linkage",
    description:
      "Mineral market development, value chain integration, and ASM trading support by MIDI.",
  },
  "/businesses/warehousing": {
    title: "Logistics & Storage Facilities",
    description:
      "Safe storage, testing, and distribution centers for strategic mineral commodities in Ethiopia.",
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
