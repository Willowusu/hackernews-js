import { parseHTML } from "linkedom";

/**
 * Convert HN HTML fields (`text`, `title`, `about`) into plain text.
 * Works in Node via linkedom; in browsers uses DOMParser.
 */
export function htmlToText(html: string): string {
  if (!html) return "";
  const { document } = parseHTML(html);

  // Option 1: textContent of body
  if (document.body && document.body.textContent) {
    return document.body.textContent.trim();
  }

  // Option 2: fallback — serialize and strip tags manually
  return document.toString().replace(/<[^>]+>/g, "").trim();
}

/**
 * Format Unix timestamp (seconds) to Date.
 */
export function toDate(unix?: number): Date | null {
  if (!unix) return null;
  return new Date(unix * 1000);
}
