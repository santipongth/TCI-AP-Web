import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['th', 'en'],
  defaultLocale: 'th',
  localePrefix: 'always',
  // Thai-first audience: `/` always lands on /th, regardless of browser language.
  localeDetection: false,
  // Nothing reads the locale cookie when detection is off; skipping it keeps pages cookie-free.
  localeCookie: false,
  // hreflang lives in the HTML (layout metadata, x-default → /th); the middleware's Link
  // header would repeat it with x-default → / and the request host instead of the real domain.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
