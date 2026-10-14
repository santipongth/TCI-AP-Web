import type { ReactNode } from 'react';
import { Eyebrow, Reveal } from '@/components/ui/primitives';
import type { FaqItem } from '@/lib/content';
import { FaqAccordion } from './FaqAccordion';

interface Props {
  t: { eyebrow: string; title: string };
  contact: ReactNode;
  items: FaqItem[];
}

/** FAQ: heading column (sticky on desktop) + card accordion. */
export function Faq({ t, contact, items }: Props) {
  return (
    <section id="faq" className="section-x border-t border-divider py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <Reveal className="flex flex-col gap-4 self-start lg:sticky lg:top-28">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="m-0 text-h2 [text-wrap:balance]">{t.title}</h2>
          <p className="m-0 text-[15.5px] leading-[1.75] text-muted">{contact}</p>
        </Reveal>
        <Reveal i={1}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
