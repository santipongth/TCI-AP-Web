import { describe, expect, it } from 'vitest';
import { splitGraphemes, splitGraphemesFallback } from './graphemes';

const CASES: Array<[string, string[]]> = [
  ['ตั้ง', ['ตั้', 'ง']],
  ['น้ำ', ['น้ำ']],
  ['ที่', ['ที่']],
  ['เครื่องมือ', ['เ', 'ค', 'รื่', 'อ', 'ง', 'มื', 'อ']],
  ['PM2.5 ภาค', ['P', 'M', '2', '.', '5', ' ', 'ภ', 'า', 'ค']],
];

describe('splitGraphemes', () => {
  it.each(CASES)('keeps Thai vowel and tone marks attached in %s', (text, expected) => {
    expect(splitGraphemes(text)).toEqual(expected);
  });

  it('round-trips the original string', () => {
    const text = 'ถามอะไรก็ได้เกี่ยวกับงานวิจัยของคุณ เช่น “สรุปงานวิจัย PM2.5 ภาคเหนือ 5 ปีล่าสุดจาก ThaiJO”';
    expect(splitGraphemes(text).join('')).toBe(text);
  });

  it('never leaves a prefix ending before a combining mark', () => {
    const text = 'เครื่องมือ AI จากทีมวิจัย TCI ที่เชื่อมกับฐานข้อมูล ThaiJO';
    const parts = splitGraphemes(text);
    for (let k = 1; k < parts.length; k++) {
      const next = parts[k]!;
      expect(next).not.toMatch(/^[ัำ-ฺ็-๎]/);
    }
  });
});

describe('splitGraphemesFallback (no Intl.Segmenter)', () => {
  it.each(CASES)('matches the segmenter for %s', (text, expected) => {
    expect(splitGraphemesFallback(text)).toEqual(expected);
  });

  it('is used when Intl.Segmenter is unavailable', () => {
    const original = Intl.Segmenter;
    Reflect.deleteProperty(Intl, 'Segmenter'); // simulate an old browser
    try {
      expect(splitGraphemes('ตั้ง')).toEqual(['ตั้', 'ง']);
    } finally {
      Object.defineProperty(Intl, 'Segmenter', { value: original, configurable: true, writable: true });
    }
  });
});
