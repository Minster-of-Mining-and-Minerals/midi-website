/**
 * Editable text blocks on the public Contact page.
 * Each is stored as a page_headers row (title + description) under its identifier,
 * edited in Admin → Contacts → Contact Details, and falls back to these defaults when empty.
 */
export const CONTACT_SECTIONS = {
    info: {
        identifier: "contact-info",
        label: "Contact Information",
        defaultTitle: "Get In Touch",
        defaultDescription:
            "Have questions about mineral testing, consultancy, or our services? Reach out to our team directly.",
    },
    form: {
        identifier: "contact-form",
        label: "Message Form",
        defaultTitle: "Send Us a Message",
        defaultDescription:
            "Fill in the form below and we will respond to your inquiry as soon as possible.",
    },
    map: {
        identifier: "contact-map",
        label: "Office Location Map",
        defaultTitle: "Office Location",
        defaultDescription:
            "Find the Mineral Industry Development Institute (MIDI) office on the interactive map below.",
    },
} as const;

export type ContactSectionKey = keyof typeof CONTACT_SECTIONS;
