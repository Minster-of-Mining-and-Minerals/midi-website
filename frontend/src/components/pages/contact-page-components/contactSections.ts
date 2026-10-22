/**
 * Editable text blocks on the public Contact page.
 * Each is stored as a page_headers row (title + description) under its identifier,
 * edited in Admin → Contacts → Contact Information, and falls back to these defaults when empty.
 */
export const CONTACT_SECTIONS = {
    info: {
        identifier: "contact-info",
        defaultTitle: "Contact Us",
        defaultDescription:
            "Get in touch with the MoMP’s Federal Office through any of the following avenues. The point of contact for email or telephone inquiries is",
    },
    form: {
        identifier: "contact-form",
        defaultTitle: "Send Us a Message",
        defaultDescription:
            "Fill in the form below and we will respond to your inquiry as soon as possible.",
    },
    map: {
        identifier: "contact-map",
        defaultTitle: "Office Location",
        defaultDescription:
            "Find the Mineral Industry Development Institute (MIDI) office on the interactive map below.",
    },
} as const;

export type ContactSectionKey = keyof typeof CONTACT_SECTIONS;

/**
 * Contact details shown on the public page until the admin saves their own
 * in Admin → Contacts → Contact Information.
 */
export const DEFAULT_CONTACT_DETAILS = {
    address: "Ministry Of Mines | Lamberet | የማዕድን ሚንስተር | ላምበረት",
    phone: "01166754806 | 0116675524 | 0116675622",
    email: "info@mom.gov.et",
    // Google Maps search used until a pin is saved
    mapQuery: "Ministry of Mines, Lamberet, Addis Ababa",
} as const;
