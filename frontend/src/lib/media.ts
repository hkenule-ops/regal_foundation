/** Only trust absolute URLs or site-relative paths coming from the API. */
export function usable(src?: string | null): src is string {
  return !!src && (/^https?:\/\//i.test(src) || src.startsWith("/"));
}

export function formatDate(
  value: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
) {
  return new Date(value).toLocaleDateString("en-NG", opts);
}

/** Estimated reading time in minutes (min 1). */
export function readingMinutes(text: string, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}