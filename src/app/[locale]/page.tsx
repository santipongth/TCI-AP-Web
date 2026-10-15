import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Architecture } from '@/components/sections/Architecture';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { HeroDemo } from '@/components/sections/HeroDemo';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Proposed } from '@/components/sections/Proposed';
import { Tools } from '@/components/sections/Tools';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getContent } from '@/lib/content';
import { fill } from '@/lib/fill';
import { formatStats, getThaiJoStats } from '@/lib/stats';

// ThaiJO stats refresh hourly (ISR). The build always renders the fallback figures, so live
// numbers appear after the first regeneration; without THAIJO_STATS_URL they never change.
export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const content = getContent(locale);
  const stats = formatStats(await getThaiJoStats(), locale);
  const otherLocale = routing.locales.find((l) => l !== locale)!;
  const { workspaceUrl, heroPattern, defaultTool, showProposed, links } = siteConfig;

  const withStats = (text: string) => fill(text, stats);

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-primary px-4 py-2 text-[14px] text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t('nav.skip')}
      </a>

      <SiteHeader
        otherLocale={otherLocale}
        ctaHref={workspaceUrl ?? '#top'}
        thaijoHref={links.thaijo}
        t={{
          brand: t('nav.brand'),
          tagline: t('nav.tagline'),
          homeLabel: t('nav.homeLabel'),
          menuLabel: t('nav.menuLabel'),
          menuOpen: t('nav.menuOpen'),
          menuClose: t('nav.menuClose'),
          tools: t('nav.tools'),
          architecture: t('nav.architecture'),
          how: t('nav.how'),
          faq: t('nav.faq'),
          thaijo: t('nav.thaijo'),
          cta: t('nav.cta'),
          switchTo: t('nav.switchTo'),
          switchLabel: t('nav.switchLabel'),
        }}
      />

      <main id="main">
        <Hero
          pattern={heroPattern}
          t={{
            eyebrow: t('hero.eyebrow'),
            titleLine1: t('hero.titleLine1'),
            titleLine2: t('hero.titleLine2'),
            leadEn: t('hero.leadEn'),
            body: t('hero.body'),
          }}
          demo={
            <HeroDemo
              tabs={content.heroTabs}
              defaultTool={defaultTool}
              workspaceUrl={workspaceUrl}
              t={{
                tablistLabel: t('hero.tablistLabel'),
                inputLabel: t.raw('hero.inputLabel') as string,
                suggestionsLabel: t('hero.suggestionsLabel'),
                attachLabel: t('hero.attachLabel'),
                pdf: t('hero.pdf'),
                source: t('hero.source'),
                sourceLabel: t('hero.sourceLabel'),
                send: t('hero.send'),
                sendSoon: t('hero.sendSoon'),
              }}
            />
          }
        />

        <Tools
          t={{
            eyebrow: t('tools.eyebrow'),
            title: t('tools.title'),
            lead: t('tools.lead', { articlesApprox: stats.articlesApprox, journals: stats.journals }),
          }}
          flagship={content.tools.flagship.map((f) => ({ ...f, bullets: f.bullets.map(withStats) }))}
          cards={content.tools.cards.map((c) => ({ ...c, body: withStats(c.body) }))}
          mockupLabels={{
            workspace: t('mockups.workspace'),
            assistant: t('mockups.assistant'),
            refs: t('mockups.refs'),
            deep: t('mockups.deep'),
            explainer: t('mockups.explainer'),
            atlas: t('mockups.atlas'),
          }}
        />

        {showProposed && (
          <Proposed
            t={{
              eyebrow: t('proposed.eyebrow'),
              title: t('proposed.title'),
              lead: t('proposed.lead'),
              concept: t('proposed.concept'),
            }}
            items={content.proposed}
          />
        )}

        <Architecture
          t={{
            eyebrow: t('architecture.eyebrow'),
            title: t('architecture.title'),
            lead: t('architecture.lead'),
            diagramLabel: t('architecture.diagramLabel'),
            legend: {
              label: t('architecture.legend.label'),
              core: t('architecture.legend.core'),
              data: t('architecture.legend.data'),
              external: t('architecture.legend.external'),
              extensible: t('architecture.legend.extensible'),
            },
          }}
          lanes={content.architecture.lanes.map((lane) => ({
            ...lane,
            boxes: lane.boxes.map((box) => ('desc' in box ? { ...box, desc: withStats(box.desc) } : box)),
          }))}
          bars={content.architecture.bars}
        />

        <HowItWorks t={{ eyebrow: t('how.eyebrow'), title: t('how.title') }} steps={content.how} />

        <Faq
          t={{ eyebrow: t('faq.eyebrow'), title: t('faq.title') }}
          contact={t.rich('faq.contact', { link: (chunks) => <a href={links.thaijo}>{chunks}</a> })}
          items={content.faq}
        />
      </main>

      <SiteFooter
        t={{
          developedBy: t('footer.developedBy'),
          copyright: t('footer.copyright'),
          partnersLabel: t('footer.partnersLabel'),
          orgNames: {
            TCI: t('footer.orgNames.TCI'),
            NECTEC: t('footer.orgNames.NECTEC'),
            NSTDA: t('footer.orgNames.NSTDA'),
          },
          logoLabels: {
            TCI: t('footer.logo', { name: 'TCI' }),
            NECTEC: t('footer.logo', { name: 'NECTEC' }),
            NSTDA: t('footer.logo', { name: 'NSTDA' }),
          },
        }}
      />
    </div>
  );
}
