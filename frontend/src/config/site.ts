/**
 * Centralized Application Identity Configuration
 * Mineral Industry Development Institute (MIDI), Ethiopia
 * Under the Ministry of Mines
 */

export const SITE_CONFIG = {
  name: "Mineral Industry Development Institute",
  shortName: "MIDI",
  acronym: "MIDI",
  parentInstitution: {
    en: "Ministry of Mines, Ethiopia",
    am: "የማዕድን ሚኒስቴር",
  },
  amharicName: "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት",
  amharicFullName: "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI)",
  tagline: {
    en: "Fostering Innovation, Value Addition, and Sustainable Growth in Ethiopia's Mineral Industry",
    am: "በኢትዮጵያ የማዕድን ኢንዱስትሪ ውስጥ ፈጠራን፣ እሴት ጭማሪን እና ዘላቂ እድገትን ማሳደግ",
  },
  defaultTitle: "Mineral Industry Development Institute | MIDI",
  titleTemplate: "%s | Mineral Industry Development Institute",
  description: {
    en: "Official portal of the Mineral Industry Development Institute (MIDI), Ethiopia. Supporting mineral exploration, processing, value addition, technical training, and industry incubation under the Ministry of Mines.",
    am: "የኢትዮጵያ የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI) ይፋዊ ድረ-ገጽ። በማዕድን ሚኒስቴር ስር የማዕድን ፍለጋ፣ ማቀነባበር፣ እሴት ጭማሪ እና የቴክኒክ ስልጠና ድጋፍ መስጫ ተቋም።",
  },
  domain: "midi.gov.et",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://midi.gov.et",
  contact: {
    email: "info@midi.gov.et",
    phone: "+251 11 667 2020",
    address: {
      en: "Bole Sub-City, Addis Ababa, Ethiopia",
      am: "ቦሌ ክ/ከተማ፣ አዲስ አበባ፣ ኢትዮጵያ",
    },
    poBox: "P.O. Box 486, Addis Ababa",
  },
  brandColor: "#ba8200",
  social: {
    facebook: "https://facebook.com/midiet",
    telegram: "https://t.me/midiet",
    linkedin: "https://linkedin.com/company/midiet",
    twitter: "https://twitter.com/midiet",
    youtube: "https://youtube.com/@midiet",
  },
  locales: ["en", "am"] as const,
  defaultLocale: "en" as const,
} as const;

export type SiteConfig = typeof SITE_CONFIG;
