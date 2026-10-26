/**
 * Footer content shown until the admin saves their own in Admin → Footer.
 * The admin form also starts with these values. A link with an empty URL is shown as plain text.
 */
export interface FooterDefaultSection {
    title: string;
    links: { label: string; url: string }[];
}

export const DEFAULT_FOOTER = {
    title: "MIDI",
    content: "",
    copyright: () => `© ${new Date().getFullYear()} MIDI. All rights reserved.`,
    logo: "/midi-log.png",
    sections: [
        {
            title: "Quick Links",
            links: [
                { label: "Home", url: "/" },
                { label: "About MIDI", url: "/about" },
                { label: "5-Year National Project", url: "/midi-project" },
                { label: "Mineral Industry Development", url: "/mineral-industry-development" },
                { label: "Laboratories & Services", url: "/services" },
            ],
        },
        {
            title: "Strategic Value Chains",
            links: [
                { label: "Metallic & Energy Minerals", url: "" },
                { label: "Agro-Minerals & Fertilizers", url: "" },
                { label: "Cement & Ceramic Industries", url: "" },
                { label: "Glass & Dimensional Stones", url: "" },
                { label: "Artisanal & Small-Scale Mining", url: "" },
            ],
        },
        {
            title: "Institutional Mandate",
            links: [
                { label: "Mineral Industry Development Institute (MIDI)", url: "" },
                { label: "Federal Democratic Republic of Ethiopia", url: "" },
                { label: "Ministry of Mines", url: "" },
                { label: "Reg. No. 508/2022 & Proc. No. 1263/2014", url: "" },
            ],
        },
    ] as FooterDefaultSection[],
};

/** The footer always shows this many link columns. */
export const FOOTER_SECTION_COUNT = 3;
