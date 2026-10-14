export interface ThaiJoStats {
  journals: number;
  issues: number;
  articles: number;
  authors: number;
}

/** As shown on tci-thaijo.org in October 2026 (README › State). */
export const FALLBACK_STATS: ThaiJoStats = {
  journals: 1858,
  issues: 39307,
  articles: 423394,
  authors: 536878,
};

const KEYS = ['journals', 'issues', 'articles', 'authors'] as const;

function isStats(value: unknown): value is ThaiJoStats {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return KEYS.every((k) => {
    const n = record[k];
    return typeof n === 'number' && Number.isInteger(n) && n > 0;
  });
}

interface Options {
  url?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

/**
 * ThaiJO totals. Without THAIJO_STATS_URL (README open item #3) this never touches the
 * network; with it, any failure or malformed payload falls back so builds never break.
 */
export async function getThaiJoStats({
  url = process.env.THAIJO_STATS_URL,
  fetchImpl = fetch,
  timeoutMs = 5000,
}: Options = {}): Promise<ThaiJoStats> {
  if (!url) return FALLBACK_STATS;
  try {
    const res = await fetchImpl(url, {
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate: 3600 },
    } as RequestInit);
    if (!res.ok) return FALLBACK_STATS;
    const body: unknown = await res.json();
    if (!isStats(body)) return FALLBACK_STATS;
    return { journals: body.journals, issues: body.issues, articles: body.articles, authors: body.authors };
  } catch {
    return FALLBACK_STATS;
  }
}

export function floorTo(n: number, step: number): number {
  return Math.floor(n / step) * step;
}

export type FormattedStats = Record<keyof ThaiJoStats | 'articlesApprox' | 'authorsApprox', string>;

export function formatStats(stats: ThaiJoStats, locale: string): FormattedStats {
  // th-TH defaults to Latin digits; Thai digits would need the -u-nu-thai extension.
  const nf = new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US');
  return {
    journals: nf.format(stats.journals),
    issues: nf.format(stats.issues),
    articles: nf.format(stats.articles),
    authors: nf.format(stats.authors),
    articlesApprox: nf.format(floorTo(stats.articles, 1000)),
    authorsApprox: nf.format(floorTo(stats.authors, 1000)),
  };
}
