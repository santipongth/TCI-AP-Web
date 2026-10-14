import type { CSSProperties } from 'react';
import { Scene } from '@/components/motion/Scene';
import { Reveal, SectionHeader, timing } from '@/components/ui/primitives';
import type { HowStep } from '@/lib/content';

interface Props {
  t: { eyebrow: string; title: string };
  steps: HowStep[];
}

const NODE = 44; // px, numbered circle

/**
 * Four-step timeline. Desktop: nodes on one row joined by a horizontal rule that
 * draws left → right. Mobile: nodes down the left edge with a vertical rule.
 * The rule runs from the first node's centre to the last node's centre.
 */
export function HowItWorks({ t, steps }: Props) {
  const vars = { '--node': `${NODE}px` } as CSSProperties;
  return (
    <section id="how" className="section-x border-t border-divider py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} align="left" className="mb-12" />
        <Scene threshold={0.35} style={vars} className="relative">
          {/* rail + animated fill: vertical below lg, horizontal from lg */}
          <span
            aria-hidden="true"
            className="absolute top-[calc(var(--node)/2)] bottom-[calc(var(--node)/2)] left-[calc(var(--node)/2-1px)] w-[2px] bg-line lg:top-[calc(var(--node)/2-1px)] lg:right-[calc((100%-72px)/4-var(--node)/2)] lg:bottom-auto lg:left-[calc(var(--node)/2)] lg:h-[2px] lg:w-auto"
          />
          <span
            aria-hidden="true"
            data-anim="grow-y-top"
            style={timing(150, 1100)}
            className="absolute top-[calc(var(--node)/2)] bottom-[calc(var(--node)/2)] left-[calc(var(--node)/2-1px)] w-[2px] bg-linear-to-b from-primary via-violet to-lilac lg:hidden"
          />
          <span
            aria-hidden="true"
            data-anim="grow-x"
            style={timing(150, 1100)}
            className="absolute top-[calc(var(--node)/2-1px)] right-[calc((100%-72px)/4-var(--node)/2)] left-[calc(var(--node)/2)] hidden h-[2px] bg-linear-to-r from-primary via-violet to-lilac lg:block"
          />
          <ol className="relative m-0 grid list-none gap-8 p-0 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <li key={step.n} className="flex gap-5 lg:flex-col lg:gap-5">
                <span
                  data-anim="pop"
                  style={timing(200 + i * 260, 420)}
                  className="mono relative z-[1] grid size-[var(--node)] flex-none place-items-center rounded-full bg-white text-[13px] font-medium text-primary shadow-[0_6px_18px_-8px_rgba(74,68,214,0.55)] ring-2 ring-primary"
                >
                  {step.n}
                </span>
                <Reveal i={i} className="flex flex-col gap-2 pt-2 lg:pt-0">
                  <h3 className="m-0 text-[17px] font-semibold [text-wrap:balance]">{step.title}</h3>
                  <p className="m-0 text-[14.5px] leading-[1.75] text-muted">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Scene>
      </div>
    </section>
  );
}
