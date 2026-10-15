import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { FALLBACK_STATS, floorTo, formatStats, getThaiJoStats } from './stats';

// Fallbacks warn on purpose; keep the test output quiet and assert on the spy instead.
beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  vi.restoreAllMocks();
});

const ok = (body: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) } as unknown as Response);

describe('getThaiJoStats', () => {
  it('returns the October 2026 fallback without fetching when no URL is set', async () => {
    const fetchImpl = vi.fn();
    await expect(getThaiJoStats({ url: undefined, fetchImpl })).resolves.toEqual({
      journals: 1858,
      issues: 39307,
      articles: 423394,
      authors: 536878,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns live numbers from a valid payload', async () => {
    const live = { journals: 1900, issues: 40000, articles: 430000, authors: 540000 };
    await expect(getThaiJoStats({ url: 'https://stats.example', fetchImpl: ok(live) })).resolves.toEqual(live);
  });

  it('falls back when fetch rejects', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'));
    await expect(getThaiJoStats({ url: 'https://stats.example', fetchImpl })).resolves.toEqual(FALLBACK_STATS);
  });

  it('falls back on a non-OK response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({}) });
    await expect(getThaiJoStats({ url: 'https://stats.example', fetchImpl })).resolves.toEqual(FALLBACK_STATS);
  });

  it('logs a warning whenever it falls back, so a broken endpoint is noticed', async () => {
    const warn = vi.mocked(console.warn);
    warn.mockClear();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({}) });
    await getThaiJoStats({ url: 'https://stats.example', fetchImpl });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('HTTP 503'));
  });

  it.each([
    ['a missing field', { journals: 1900, issues: 40000, articles: 430000 }],
    ['a string number', { journals: '1900', issues: 40000, articles: 430000, authors: 540000 }],
    ['a zero', { journals: 0, issues: 40000, articles: 430000, authors: 540000 }],
    ['a fraction', { journals: 1900.5, issues: 40000, articles: 430000, authors: 540000 }],
    ['null', null],
  ])('falls back on a payload with %s', async (_label, body) => {
    await expect(getThaiJoStats({ url: 'https://stats.example', fetchImpl: ok(body) })).resolves.toEqual(
      FALLBACK_STATS,
    );
  });
});

describe('floorTo', () => {
  it('floors to the step', () => {
    expect(floorTo(423394, 1000)).toBe(423000);
    expect(floorTo(536878, 1000)).toBe(536000);
    expect(floorTo(1000, 1000)).toBe(1000);
  });
});

describe('formatStats', () => {
  it('formats with Latin digits and grouping in Thai', () => {
    expect(formatStats(FALLBACK_STATS, 'th')).toEqual({
      journals: '1,858',
      issues: '39,307',
      articles: '423,394',
      authors: '536,878',
      articlesApprox: '423,000',
      authorsApprox: '536,000',
    });
  });

  it('formats English the same way', () => {
    expect(formatStats(FALLBACK_STATS, 'en').articlesApprox).toBe('423,000');
  });
});
