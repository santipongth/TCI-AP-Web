import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

/** One entry per locale, each listing the other as its hreflang alternate. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}`]));
  return routing.locales.map((locale) => ({
    url: `${base}/${locale}`,
    changeFrequency: 'monthly',
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
