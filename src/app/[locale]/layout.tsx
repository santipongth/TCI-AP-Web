import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans_Thai } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-thai',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

// Runs before first paint: marks JS as available so motion.css may hide reveal targets.
const JS_FLAG = `document.documentElement.classList.add('js')`;

// Runs at the end of <body>, before hydration, so deep links never land on hidden sections.
const REVEAL = `(function(){var els=document.querySelectorAll('[data-reveal]');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.setAttribute('data-in','')});return}var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.setAttribute('data-in','');io.unobserve(en.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:0.08});els.forEach(function(e){io.observe(e)})})();`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}`]));
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `/${locale}`, languages: { ...languages, 'x-default': `/${routing.defaultLocale}` } },
    openGraph: {
      type: 'website',
      title: t('title'),
      description: t('description'),
      locale: t('ogLocale'),
      url: `/${locale}`,
      siteName: 'TCI AI',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${plexThai.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        {/* Client components receive their strings as props; no messages are shipped. */}
        <NextIntlClientProvider messages={null}>{children}</NextIntlClientProvider>
        <script dangerouslySetInnerHTML={{ __html: REVEAL }} />
      </body>
    </html>
  );
}
