export type WordState = "hidden" | "active" | "settled";

export interface ParsedWord {
  word: string;
  index: number;
}

/**
 * Split a multi-paragraph text block into paragraphs of indexed words.
 * Each word carries a stable global `index` across the entire text, so
 * the consumer can map a single "active word index" onto a flat refs
 * array even though the rendered DOM nests words inside paragraphs.
 */
export function parseAboutText(text: string): ParsedWord[][] {
  let idx = 0;
  return text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.split(/\s+/).map((word) => ({ word, index: idx++ })));
}
