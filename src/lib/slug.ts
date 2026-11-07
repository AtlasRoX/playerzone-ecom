/**
 * Convert a string into a URL-safe slug.
 * - Lowercases
 * - Removes diacritics
 * - Replaces any non-alphanumeric run with a single dash
 * - Trims leading/trailing dashes
 * - Caps at 80 chars
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
