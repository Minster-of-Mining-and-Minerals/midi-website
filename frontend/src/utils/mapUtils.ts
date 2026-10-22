/**
 * Utility functions for coordinate parsing and Google Maps URL generation
 * Ensures consistency between Admin MapPicker and Public Contact / Map pages.
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

// Default fallback location: Bole, Addis Ababa, Ethiopia
export const DEFAULT_COORDINATES: Coordinates = {
    lat: 9.005400,
    lng: 38.784400,
};

function isValidCoord(lat: number, lng: number): boolean {
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Finds latitude and longitude in any of these formats, or returns null:
 * - "https://www.google.com/maps?q=9.005400,38.784400"
 * - "https://www.google.com/maps?q=9.005400,38.784400&output=embed"
 * - "https://maps.google.com/?q=9.005400,38.784400"
 * - "https://www.google.com/maps/place/.../@9.0054,38.7844,17z/..."
 * - "9.005400,38.784400"
 */
export function findCoordinates(locationStr?: string | null): Coordinates | null {
    if (!locationStr || typeof locationStr !== "string") {
        return null;
    }

    // 1. Check for @lat,lng in Google Maps place URLs
    const atMatch = locationStr.match(/@([-+]?\d{1,2}(?:\.\d+)?),([-+]?\d{1,3}(?:\.\d+)?)/);
    if (atMatch) {
        const lat = parseFloat(atMatch[1]);
        const lng = parseFloat(atMatch[2]);
        if (isValidCoord(lat, lng)) return { lat, lng };
    }

    // 2. Check for [?&](q|query)=lat,lng
    const qMatch = locationStr.match(/[?&](?:q|query)=([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)/);
    if (qMatch) {
        const lat = parseFloat(qMatch[1]);
        const lng = parseFloat(qMatch[2]);
        if (isValidCoord(lat, lng)) return { lat, lng };
    }

    // 3. The whole value is a raw "lat,lng" pair (so addresses like "Road 22, 34" are not mistaken for coordinates)
    const rawMatch = locationStr.match(/^\s*([-+]?\d{1,2}(?:\.\d+)?)\s*,\s*([-+]?\d{1,3}(?:\.\d+)?)\s*$/);
    if (rawMatch) {
        const lat = parseFloat(rawMatch[1]);
        const lng = parseFloat(rawMatch[2]);
        if (isValidCoord(lat, lng)) return { lat, lng };
    }

    return null;
}

/**
 * Same as findCoordinates, but falls back to DEFAULT_COORDINATES (used to center the admin MapPicker).
 */
export function extractCoordinates(locationStr?: string | null): Coordinates {
    return findCoordinates(locationStr) ?? DEFAULT_COORDINATES;
}

/**
 * Generates a clean Google Maps URL for opening in a browser tab or mobile app.
 * Plain text (e.g. an address) is searched instead of being replaced by the default pin.
 * IMPORTANT: NEVER includes &output=embed, preventing the "location not found" error in Google Maps.
 */
export function getGoogleMapsUrl(locationStr?: string | null): string {
    const coords = findCoordinates(locationStr);
    if (!coords && locationStr?.trim()) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr.trim())}`;
    }
    const { lat, lng } = coords ?? DEFAULT_COORDINATES;
    return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * Generates an iframe embed URL for displaying Google Maps on page.
 * Plain text (e.g. an address) is searched instead of being replaced by the default pin.
 */
export function getGoogleMapsEmbedUrl(locationStr?: string | null): string {
    const coords = findCoordinates(locationStr);
    if (!coords && locationStr?.trim()) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(locationStr.trim())}&hl=en&z=16&output=embed`;
    }
    const { lat, lng } = coords ?? DEFAULT_COORDINATES;
    return `https://maps.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}&hl=en&z=16&output=embed`;
}
