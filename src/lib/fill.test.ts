import { describe, expect, it } from 'vitest';
import { fill } from './fill';

describe('fill', () => {
  it('replaces {placeholders} with values', () => {
    expect(fill('ทั้ง {journals} วารสาร', { journals: '1,858' })).toBe('ทั้ง 1,858 วารสาร');
  });

  it('replaces every occurrence and several keys', () => {
    expect(fill('{a}-{b}-{a}', { a: '1', b: '2' })).toBe('1-2-1');
  });

  it('leaves unknown placeholders untouched so missing data is visible', () => {
    expect(fill('{known} {unknown}', { known: 'x' })).toBe('x {unknown}');
  });

  it('returns the text unchanged when there are no placeholders', () => {
    expect(fill('plain', { a: '1' })).toBe('plain');
  });
});
