import { BookOpenText, Library, MessagesSquare, TrendingUp, UserRoundCheck, Users, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { AssistantMock } from '@/components/mockups/AssistantMock';
import { AtlasMock } from '@/components/mockups/AtlasMock';
import { DeepResearchMock } from '@/components/mockups/DeepResearchMock';
import { ExplainerMock } from '@/components/mockups/ExplainerMock';
import { RefsMock } from '@/components/mockups/RefsMock';
import { WorkspaceMock } from '@/components/mockups/WorkspaceMock';
import { Badge, BulletList, Reveal, SectionHeader } from '@/components/ui/primitives';
import type { Flagship, FlagshipId, ToolCard } from '@/lib/content';

const MOCKUPS: Record<FlagshipId, (props: { label: string }) => ReactNode> = {
  workspace: WorkspaceMock,
  assistant: AssistantMock,
  refs: RefsMock,
  deep: DeepResearchMock,
  explainer: ExplainerMock,
  atlas: AtlasMock,
};

const CARD_ICONS: Record<string, LucideIcon> = {
  CB: MessagesSquare,
  RF: UserRoundCheck,
  LR: BookOpenText,
  JF: Library,
  AF: Users,
  ET: TrendingUp,
};

/** Bento on 4 columns: wide, narrow, narrow / narrow, narrow, wide. */
const BENTO_WIDE = new Set([0, 5]);

interface Props {
  t: { eyebrow: string; title: string; lead: string };
  flagship: Flagship[];
  cards: ToolCard[];
  mockupLabels: Record<FlagshipId, string>;
}

/**
 * One flagship row. DOM order is text → mockup so a single column always reads text
 * first; on mockup-left rows a container query moves the mockup first once both
 * columns fit. The mockup sits on a soft gradient stage, which is also the container
 * the mockups query to reflow on narrow screens.
 */
function FeatureRow({ feature, mockupFirst, mockup }: { feature: Flagship; mockupFirst: boolean; mockup: ReactNode }) {
  return (
    <div className="@container py-10 lg:py-14">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-10 lg:gap-16">
        <Reveal className="flex max-w-[480px] flex-col gap-4">
          <Badge>{feature.badge}</Badge>
          <h3 className="m-0 text-h3 [text-wrap:balance]">{feature.title}</h3>
          <p className="m-0 text-[15.5px] leading-[1.8] text-body">{feature.body}</p>
          <BulletList items={feature.bullets} />
        </Reveal>
        <Reveal i={1} className={`min-w-0 ${mockupFirst ? '@min-[688px]:order-first' : ''}`}>
          <div className="stage @container rounded-[28px] p-3 sm:p-5 lg:p-6">{mockup}</div>
        </Reveal>
      </div>
    </div>
  );
}

export function Tools({ t, flagship, cards, mockupLabels }: Props) {
  return (
    <section id="tools" className="section-x pt-20 pb-16 sm:pt-28">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} className="mb-10 lg:mb-14" />

        {flagship.map((feature, i) => {
          const Mock = MOCKUPS[feature.id];
          return (
            <FeatureRow
              key={feature.id}
              feature={feature}
              mockupFirst={i % 2 === 0}
              mockup={<Mock label={mockupLabels[feature.id] ?? feature.title} />}
            />
          );
        })}

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = CARD_ICONS[card.mono] ?? MessagesSquare;
            const wide = BENTO_WIDE.has(i);
            return (
              // Reveal owns the entrance transition; the card owns its hover transition.
              <Reveal key={card.mono} i={i % 3} className={wide ? 'lg:col-span-2' : ''}>
                <div
                  className={`card-glow group flex h-full flex-col gap-3 rounded-[22px] border border-line p-6 shadow-card transition-[box-shadow,translate] duration-300 hover:shadow-card-hover motion-safe:hover:-translate-y-1 ${
                    wide ? 'bg-[linear-gradient(135deg,#fff_45%,#f3f2ff)]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-[14px] bg-linear-to-br from-primary-tint to-white text-primary ring-1 ring-primary-line transition-transform duration-300 motion-safe:group-hover:scale-105">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="mono text-[11px] tracking-[0.08em] text-faint">{card.mono}</span>
                  </div>
                  <h4 className="m-0 mt-2 text-[18px] font-semibold">{card.title}</h4>
                  <p className="m-0 text-[14.5px] leading-[1.75] text-muted">{card.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
