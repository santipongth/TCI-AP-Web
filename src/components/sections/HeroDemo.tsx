'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { track } from '@/lib/analytics';
import type { HeroTab, ToolId } from '@/lib/content';
import { fill } from '@/lib/fill';
import { useTabIndicator } from '@/lib/motion/use-tab-indicator';
import { useTypewriter } from '@/lib/motion/use-typewriter';

interface Props {
  tabs: HeroTab[];
  defaultTool: ToolId;
  /** Agentic Workspace URL; while undefined the submit button is inert. */
  workspaceUrl?: string;
  t: {
    tablistLabel: string;
    /** Contains `{tool}`. */
    inputLabel: string;
    suggestionsLabel: string;
    attachLabel: string;
    pdf: string;
    source: string;
    sourceLabel: string;
    send: string;
    sendSoon: string;
  };
}

/** Hero demo box: tool tabs, prompt field, suggestion chips (README › Hero › Demo box). */
export function HeroDemo({ tabs, defaultTool, workspaceUrl, t }: Props) {
  const uid = useId();
  const initial = Math.max(0, tabs.findIndex((tab) => tab.id === defaultTool));
  const [activeIndex, setActiveIndex] = useState(initial);
  const [value, setValue] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { indicatorRef, ready } = useTabIndicator(listRef, activeIndex);

  const active = tabs[activeIndex]!;
  const placeholder = useTypewriter(active.placeholder);
  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = `${uid}-panel`;
  const soonId = `${uid}-soon`;

  const select = (index: number, focus = false) => {
    const next = (index + tabs.length) % tabs.length;
    if (next !== activeIndex) track({ name: 'tab_change', tool: tabs[next]!.id });
    setActiveIndex(next);
    if (focus) {
      const el = tabRefs.current[next];
      el?.focus();
      el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target, true);
  };

  const pickChip = (chip: string) => {
    track({ name: 'chip_click', tool: active.id, chip });
    setValue(chip);
    inputRef.current?.focus();
  };

  return (
    <div className="relative mx-auto mt-11 max-w-[860px] text-left">
      <div
        ref={listRef}
        role="tablist"
        aria-label={t.tablistLabel}
        onKeyDown={onTabKeyDown}
        className="relative flex gap-1 overflow-x-auto px-[10px] [scrollbar-color:#dcdce2_transparent] [scrollbar-width:thin]"
      >
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 h-full origin-left rounded-t-[10px] bg-primary ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
        {tabs.map((tab, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={`relative z-[1] cursor-pointer appearance-none rounded-t-[10px] border-0 px-4 py-3 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none ${
                selected ? `text-white ${ready ? 'bg-transparent' : 'bg-primary'}` : 'bg-transparent text-tab hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(active.id)}>
        <form
          action={workspaceUrl}
          method="get"
          onSubmit={(event) => {
            if (!workspaceUrl) {
              event.preventDefault();
              return;
            }
            track({ name: 'cta_click', location: 'hero_submit' });
          }}
          className="overflow-hidden rounded-[16px] border border-line bg-white shadow-demo transition-[border-color,box-shadow] duration-200 focus-within:border-primary-line-hover"
        >
          <input type="hidden" name="tool" value={active.id} />
          {/* The ::after copy sizes the field from the full placeholder (or value), so the
              box never jumps while the placeholder types out. */}
          <div
            data-full={value || active.placeholder}
            className="grid min-h-[96px] after:invisible after:col-start-1 after:row-start-1 after:px-6 after:pt-[22px] after:pb-2 after:text-[15.5px] after:leading-[1.6] after:whitespace-pre-wrap after:content-[attr(data-full)_'_']"
          >
            <textarea
              ref={inputRef}
              name="q"
              rows={1}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              aria-label={fill(t.inputLabel, { tool: active.label })}
              className="col-start-1 row-start-1 resize-none overflow-hidden border-0 bg-transparent px-6 pt-[22px] pb-2 text-[15.5px] leading-[1.6] text-ink outline-none placeholder:text-subtle focus-visible:outline-none"
            />
          </div>

          <div role="group" aria-label={t.suggestionsLabel} className="flex flex-wrap gap-2 px-5 pb-4">
            {active.chips.map((chip, i) => (
              <button
                key={`${active.id}-${chip}`}
                type="button"
                onClick={() => pickChip(chip)}
                className="hero-chip cursor-pointer rounded-full border border-primary-line bg-primary-tint px-[10px] py-[5px] text-[12.5px] text-primary transition-colors hover:border-primary-line-hover"
                style={{ '--i': i } as React.CSSProperties}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-hair-2 bg-surface-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                role="img"
                aria-label={t.attachLabel}
                className="grid size-8 place-items-center rounded-[8px] border border-line bg-white text-[18px] text-muted"
              >
                +
              </span>
              <span className="mono flex h-8 items-center rounded-[8px] border border-line bg-white px-[10px] text-[12.5px] text-muted">
                {t.pdf}
              </span>
              <span
                title={t.sourceLabel}
                className="flex h-8 items-center gap-2 rounded-[8px] border border-line bg-white px-3 text-[13px] whitespace-nowrap text-ink"
              >
                <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
                {t.source} <span className="text-faint">▾</span>
              </span>
            </div>
            <button
              type="submit"
              aria-label={t.send}
              aria-disabled={workspaceUrl ? undefined : true}
              aria-describedby={workspaceUrl ? undefined : soonId}
              title={workspaceUrl ? undefined : t.sendSoon}
              className="grid size-9 flex-none cursor-pointer place-items-center rounded-full border-0 bg-primary text-[18px] text-white transition-[background-color,transform] duration-200 hover:bg-primary-hover active:scale-95 aria-disabled:cursor-default motion-reduce:transition-none"
            >
              ↑
            </button>
            {!workspaceUrl && (
              <span id={soonId} hidden>
                {t.sendSoon}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
