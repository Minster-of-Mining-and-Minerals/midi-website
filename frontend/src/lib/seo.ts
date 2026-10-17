import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_NAME = "MIDI";
export const DEFAULT_DESCRIPTION =
  "Official portal of the Mineral Industry Development Institute (MIDI).";

const DEFAULT_OG_IMAGE = "/midi-log.png";

/** Canonical public site URL (no trailing slash). */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    return process.env.NEXT_PUBLIC_FRONTEND_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://midi.gov.et";
}

export type PageSeoInput = {
  title: string;
  description?: string;
  path?: string;
  locale?: string;
  image?: string;
  noIndex?: boolean;
};

function buildCanonicalUrl(path: string, locale: string): string {
  const siteUrl = getSiteUrl();
  const normalizedPath = path === "/" ? "" : path;
  return `${siteUrl}/${locale}${normalizedPath}`;
}

/** Build Next.js Metadata for a public page. */
export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  locale = routing.defaultLocale,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageSeoInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = buildCanonicalUrl(path, locale);
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = buildCanonicalUrl(path, loc);
  }

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      locale: locale === "am" ? "am_ET" : "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [{ url: imageUrl, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Default metadata for the root layout (title template). */
export function getRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/favicon_io/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: "/favicon_io/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [{ url: `${siteUrl}${DEFAULT_OG_IMAGE}`, alt: SITE_NAME }],
    },
  };
}

export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};
