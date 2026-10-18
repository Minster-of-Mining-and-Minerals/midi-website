/** Server-side API helpers for metadata generation (no auth required for public data). */

function getApiBaseUrl(): string {
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";
}

export async function fetchPublicNewsById(id: string) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/news/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchPublicEventById(id: string) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/events/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

/** Extract plain text from a Quill Delta JSON object. */
export function deltaToPlainText(delta: unknown): string {
  if (!delta || typeof delta !== "object" || !("ops" in delta)) return "";
  const ops = (delta as { ops: unknown[] }).ops;
  if (!Array.isArray(ops)) return "";
  return ops
    .filter((op) => op && typeof op === "object" && "insert" in op && typeof (op as { insert: unknown }).insert === "string")
    .map((op) => (op as { insert: string }).insert)
    .join("")
    .trim();
}
