import { Sparkles } from 'lucide-react';
import { Eyebrow, Reveal } from '@/components/ui/primitives';
import type { ProposedItem } from '@/lib/content';

const AUDIENCE: Record<ProposedItem['audience'], string> = {
  editor: 'text-warn-ink bg-warn-bg',
  both: 'text-warn-ink bg-warn-bg',
  author: 'text-info-ink bg-info-bg',
};

interface Props {
  t: { eyebrow: string; title: string; lead: string; concept: string };
  items: ProposedItem[];
}

/** Proposed concepts, shown when `showProposed` is on. Dashed cards signal "not built yet". */
export function Proposed({ t, items }: Props) {
  return (
    <section id="proposed" className="section-x relative border-y border-divider bg-surface py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_100%_0%,rgba(124,118,255,0.08),transparent)]" />
      <div className="relative mx-auto max-w-[1120px]">
        <Reveal className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-end gap-6 lg:gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="m-0 text-h2 [text-wrap:balance]">{t.title}</h2>
          </div>
          <p className="m-0 text-[15.5px] leading-[1.75] text-muted">{t.lead}</p>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
          {items.map((item, i) => (
            <Reveal key={item.title} i={i % 3}>
              <div className="flex h-full flex-col gap-3 rounded-[22px] border border-dashed border-dash bg-white/80 p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary-line-hover hover:shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <span className="mono inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[10.5px] tracking-[0.06em] text-muted">
                    <Sparkles aria-hidden="true" className="size-3 text-violet" />
                    {t.concept}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[12px] ${AUDIENCE[item.audience]}`}>{item.audienceLabel}</span>
                </div>
                <h3 className="m-0 mt-2 text-[17.5px] font-semibold [text-wrap:balance]">{item.title}</h3>
                <p className="m-0 text-[14.5px] leading-[1.75] text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
