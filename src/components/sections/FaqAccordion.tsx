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
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const expanded = open === i;
        const buttonId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div
            key={item.question}
            className={`rounded-[18px] border transition-[background-color,border-color,box-shadow] duration-300 ${
              expanded ? 'border-primary-line bg-[linear-gradient(180deg,#f6f5ff,#fff)] shadow-card' : 'border-line bg-white hover:border-primary-line-hover'
            }`}
          >
            <h3 className="m-0 text-[16px] font-medium">
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[18px] border-0 bg-transparent px-5 py-4 text-left text-[16px] font-medium text-ink sm:px-6 sm:py-5"
              >
                {item.question}
                {/* Two bars draw the icon so the vertical one can rotate into "−". */}
                <span
                  aria-hidden="true"
                  className={`relative grid size-8 flex-none place-items-center rounded-full transition-colors duration-300 ${
                    expanded ? 'bg-primary text-white' : 'bg-primary-tint text-primary'
                  }`}
                >
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
                <p className="m-0 px-5 pb-5 text-[15px] leading-[1.8] text-body sm:px-6 sm:pr-16">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
