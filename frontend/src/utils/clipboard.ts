/**
 * Copy text to the clipboard. Browsers only allow `navigator.clipboard` on https or localhost,
 * so on plain http (the live server) fall back to the older copy command.
 */
export async function copyText(text: string): Promise<boolean> {
    if (typeof window === "undefined") return false;

    if (window.isSecureContext && navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Permission denied: try the fallback below
        }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}
