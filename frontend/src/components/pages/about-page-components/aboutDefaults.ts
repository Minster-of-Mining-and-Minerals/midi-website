/**
 * About page content shown until the admin saves their own (Admin → About Us Management).
 * The public sections fall back to these, and the admin forms start with them,
 * so the admin always sees what is currently live.
 */
export const ABOUT_BACKGROUND_DEFAULTS = {
    title: "Mineral Industry Development Institute (MIDI)",
    description:
        "Established under Proclamation No. 1263/2014 and governed by Regulation No. 508/2022 under the Ministry of Mines, the Mineral Industry Development Institute (MIDI) is mandated to support the national mineral industry in applied research & development, technical consultancy, modern laboratory testing, and specialized human capital development to foster production, import substitution, and sustainable economic transformation.",
    icon: "Building2",
};

/**
 * Leadership section title/description: stored as a page_headers row. Older data kept it as
 * JSON in the root leader's `header` column (255 chars), which is still read as a fallback.
 */
export const LEADERSHIP_SECTION = {
    identifier: "about-leadership",
    defaultTitle: "Corporate Leadership Structure",
    defaultDescription: "Interactive organizational hierarchy",
};

export function readLegacyLeadershipHeader(header?: string | null): { title?: string; description?: string } {
    if (!header || header === "Leader") return {};
    try {
        const parsed = JSON.parse(header);
        return { title: parsed.title, description: parsed.description };
    } catch {
        return { title: header };
    }
}

export const ABOUT_STRATEGY_DEFAULTS = {
    title: "Strategic Framework & Objectives",
    description: "Empowering the Ethiopian mineral industry through innovation, quality, and human capacity.",
    mission:
        "To support the mineral industry through applied research and development, capacity building, technical consultancy, and modern laboratory testing to enhance production, foster import substitution, and stimulate sustainable job creation.",
    vision:
        "To become a premier center of excellence in mineral technology, innovative research, and human capital development in Africa by 2030.",
    values: [
        { title: "Research & Innovation", content: "Conducting problem-solving applied research and adopting state-of-the-art mineral technologies." },
        { title: "Excellence & Quality", content: "Upholding world-class standards in laboratory testing, material characterization, and consultancy." },
        { title: "Integrity & Accountability", content: "Transparent, evidence-based leadership and responsible stewardship of public resources." },
        { title: "Sustainable Development", content: "Balancing mineral wealth generation with environmental preservation and community benefit." },
        { title: "Human Capital Growth", content: "Empowering industry-driven professionals and supporting ASM formalization." },
        { title: "Value Creation", content: "Driving import substitution and expanding export revenues through national value addition." },
    ],
};

// Amharic text when the page is in Amharic and the admin filled it in, otherwise the English text
export function pickLocalized(locale: string, en: string, am?: string | null): string {
    return locale === "am" && am?.trim() ? am : en;
}
