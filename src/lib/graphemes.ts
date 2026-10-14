// Thai above/below vowels, SARA AM and tone marks attach to the preceding consonant.
const THAI_COMBINING = /[ัำ-ฺ็-๎]/;

/** Splits text into user-perceived characters so a typewriter never shows a detached tone mark. */
export function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('th', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return splitGraphemesFallback(text);
}

/** Approximation for browsers without Intl.Segmenter: attaches Thai combining marks to the previous character. */
export function splitGraphemesFallback(text: string): string[] {
  const out: string[] = [];
  for (const ch of text) {
    if (out.length > 0 && THAI_COMBINING.test(ch)) out[out.length - 1] += ch;
    else out.push(ch);
  }
  return out;
}
