export type ContentRecord = Record<string, unknown>;

export function englishContent(value: unknown): ContentRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const language = (value as Record<string, unknown>).en;
  return language && typeof language === "object" && !Array.isArray(language)
    ? (language as ContentRecord)
    : {};
}

export function text(value: unknown, fallback = "Editorial content for this entry is being prepared.") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function records(value: unknown): Array<Record<string, string>> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    return [Object.fromEntries(Object.entries(item).filter(([, field]) => typeof field === "string")) as Record<string, string>];
  });
}

export function readingTime(...parts: Array<string | null | undefined>) {
  const words = parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 220))} min read`;
}
