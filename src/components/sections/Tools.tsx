import type { ReactNode } from 'react';
import { AssistantMock } from '@/components/mockups/AssistantMock';
import { AtlasMock } from '@/components/mockups/AtlasMock';
import { DeepResearchMock } from '@/components/mockups/DeepResearchMock';
import { ExplainerMock } from '@/components/mockups/ExplainerMock';
import { RefsMock } from '@/components/mockups/RefsMock';
import { WorkspaceMock } from '@/components/mockups/WorkspaceMock';
import { Badge, BulletList, Eyebrow, Reveal } from '@/components/ui/primitives';
import type { Flagship, FlagshipId, ToolCard } from '@/lib/content';

const MOCKUPS: Record<FlagshipId, (props: { label: string }) => ReactNode> = {
  workspace: WorkspaceMock,
  assistant: AssistantMock,
  refs: RefsMock,
  deep: DeepResearchMock,
  explainer: ExplainerMock,
  atlas: AtlasMock,
};

const MOCK_LABEL_KEY: Record<FlagshipId, string> = {
  workspace: 'workspace',
  assistant: 'assistant',
  refs: 'refs',
  deep: 'deep',
  explainer: 'explainer',
  atlas: 'atlas',
};

interface Props {
  t: { eyebrow: string; title: string; lead: string };
  flagship: Flagship[];
  cards: ToolCard[];
  mockupLabels: Record<string, string>;
}

/**
 * One flagship row. DOM order is text → mockup so a single column always reads text
 * first; on mockup-left rows a container query moves the mockup first once two
 * 300px columns fit (300 + 48 + 300 = 648px, exactly where auto-fit splits).
 */
function FeatureRow({ feature, mockupFirst, mockup }: { feature: Flagship; mockupFirst: boolean; mockup: ReactNode }) {
  return (
    <div className="@container py-9">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-12">
        <Reveal className="flex max-w-[440px] flex-col gap-[14px]">
          <Badge>{feature.badge}</Badge>
          <h3 className="m-0 text-h3">{feature.title}</h3>
          <p className="m-0 text-[15px] leading-[1.75] text-body">{feature.body}</p>
          <BulletList items={feature.bullets} />
        </Reveal>
        <Reveal i={1} className={`min-w-0 ${mockupFirst ? '@min-[648px]:order-first' : ''}`}>
          {mockup}
        </Reveal>
      </div>
    </div>
  );
}

export function Tools({ t, flagship, cards, mockupLabels }: Props) {
  return (
    <section id="tools" className="section-x pt-[88px] pb-10">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mx-auto mb-[72px] flex max-w-[720px] flex-col items-center gap-[14px] text-center">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="m-0 text-h2">{t.title}</h2>
          <p className="m-0 text-[16px] leading-[1.7] text-muted">{t.lead}</p>
        </Reveal>

        {flagship.map((feature, i) => {
          const Mock = MOCKUPS[feature.id];
          return (
            <FeatureRow
              key={feature.id}
              feature={feature}
              mockupFirst={i % 2 === 0}
              mockup={<Mock label={mockupLabels[MOCK_LABEL_KEY[feature.id]] ?? feature.title} />}
            />
          );
        })}

        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
          {cards.map((card, i) => (
            // Reveal owns the entrance transition; the card owns its hover transition.
            <Reveal key={card.mono} i={i % 3}>
              <div className="flex h-full flex-col gap-[10px] rounded-[14px] border border-line bg-white p-[22px] transition-[border-color,box-shadow,translate] duration-200 hover:border-primary-line-hover hover:shadow-lift motion-safe:hover:-translate-y-0.5">
                <span className="mono grid size-[38px] place-items-center rounded-[10px] bg-primary-tint text-[12px] font-medium text-primary">
                  {card.mono}
                </span>
                <h4 className="m-0 mt-1 text-[17px] font-semibold">{card.title}</h4>
                <p className="m-0 text-[14px] leading-[1.7] text-muted">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
