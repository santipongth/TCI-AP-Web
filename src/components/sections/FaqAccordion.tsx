'use client';

import { useId, useState } from 'react';
import { track } from '@/lib/analytics';
import type { FaqItem } from '@/lib/content';

/** Single-open accordion, first item open on load (README › FAQ). */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const uid = useId();
  const [open, setOpen] = useState(0);

  const toggle = (index: number) => {
    const next = open === index ? -1 : index;
    if (next !== -1) track({ name: 'faq_open', index: next });
    setOpen(next);
  };

  return (
    <div className="flex flex-col border-t border-line">
      {items.map((item, i) => {
        const expanded = open === i;
        const buttonId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div key={item.question} className="border-b border-line">
            <h3 className="m-0 text-[16px] font-medium">
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-[18px] text-left text-[16px] font-medium text-ink"
              >
                {item.question}
                {/* The invisible 20px "+" keeps the reference's line box (and row height);
                    the two bars draw the icon so the vertical one can rotate into "−". */}
                <span aria-hidden="true" className="relative flex-none text-[20px] text-primary">
                  <span className="invisible">+</span>
                  <span className="absolute top-1/2 left-1/2 h-[1.5px] w-[11px] -translate-1/2 rounded-full bg-current" />
                  <span
                    className={`absolute top-1/2 left-1/2 h-[11px] w-[1.5px] -translate-1/2 rounded-full bg-current transition-transform duration-200 ease-out motion-reduce:transition-none ${
                      expanded ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!expanded}
              className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="m-0 pr-10 pb-[18px] text-[14.5px] leading-[1.75] text-body">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
