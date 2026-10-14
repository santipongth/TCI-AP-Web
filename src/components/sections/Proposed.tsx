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

/** Proposed concepts (README › 4), shown when `showProposed` is on. */
export function Proposed({ t, items }: Props) {
  return (
    <section id="proposed" className="section-x border-y border-divider bg-white py-[88px]">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-end gap-8">
          <div className="flex flex-col gap-3">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="m-0 text-h2">{t.title}</h2>
          </div>
          <p className="m-0 text-[15px] leading-[1.7] text-muted">{t.lead}</p>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
          {items.map((item, i) => (
            <Reveal key={item.title} i={i % 3}>
              <div className="flex h-full flex-col gap-[10px] rounded-[14px] border border-dashed border-dash bg-white p-[22px] transition-colors duration-200 hover:border-primary-line-hover">
                <div className="flex items-center justify-between">
                  <span className="mono rounded-[5px] border border-line px-[7px] py-[3px] text-[10.5px] tracking-[0.06em] text-muted">
                    {t.concept}
                  </span>
                  <span className={`rounded-full px-2 py-[3px] text-[12px] ${AUDIENCE[item.audience]}`}>{item.audienceLabel}</span>
                </div>
                <h3 className="m-0 mt-[6px] text-[17px] font-semibold">{item.title}</h3>
                <p className="m-0 text-[14px] leading-[1.7] text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
