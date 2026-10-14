import { Scene } from '@/components/motion/Scene';
import { Eyebrow, Reveal, timing } from '@/components/ui/primitives';
import type { HowStep } from '@/lib/content';

interface Props {
  t: { eyebrow: string; title: string };
  steps: HowStep[];
}

/**
 * How it works (README › 6). The 2px primary top rule is an overlay that fills
 * left-to-right per card; at rest it covers the card's own top border exactly.
 */
export function HowItWorks({ t, steps }: Props) {
  return (
    <section id="how" className="section-x border-t border-divider pt-[72px] pb-24">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-10 flex flex-col gap-3">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="m-0 text-h2">{t.title}</h2>
        </Reveal>
        <Scene threshold={0.4} className="grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} i={i}>
              <div className="how-card relative flex h-full flex-col gap-3 rounded-b-[12px] border border-t-2 border-divider border-t-primary bg-white p-[22px]">
                <span
                  aria-hidden="true"
                  data-anim="grow-x"
                  style={timing(250 + i * 150, 700)}
                  className="how-rule absolute -top-[2px] -right-px -left-px h-[2px] bg-primary"
                />
                <span className="mono text-[12px] text-primary">{step.n}</span>
                <h4 className="m-0 text-[16px] font-semibold">{step.title}</h4>
                <p className="m-0 text-[14px] leading-[1.7] text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </Scene>
      </div>
    </section>
  );
}
