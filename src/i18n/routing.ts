import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['th', 'en'],
  defaultLocale: 'th',
  localePrefix: 'always',
  // Thai-first audience: `/` always lands on /th, regardless of browser language.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
