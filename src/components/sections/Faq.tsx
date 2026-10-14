import type { ReactNode } from 'react';
import { Eyebrow, Reveal } from '@/components/ui/primitives';
import type { FaqItem } from '@/lib/content';
import { FaqAccordion } from './FaqAccordion';

interface Props {
  t: { eyebrow: string; title: string };
  contact: ReactNode;
  items: FaqItem[];
}

/** FAQ (README › 7): heading column + single-open accordion. */
export function Faq({ t, contact, items }: Props) {
  return (
    <section id="faq" className="section-x border-t border-divider py-24">
      <div className="mx-auto grid max-w-[1120px] grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-12">
        <Reveal className="flex flex-col gap-3 self-start">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="m-0 text-h2">{t.title}</h2>
          <p className="m-0 text-[15px] leading-[1.7] text-muted">{contact}</p>
        </Reveal>
        <Reveal i={1}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
