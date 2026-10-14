'use client';

import { ArrowUp, ChevronDown, FileText, Plus } from 'lucide-react';
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
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
    <div className="relative mx-auto mt-12 max-w-[920px] text-left">
      {/* Mobile: one swipeable row with a fade at the edge. sm+: pills wrap and centre. */}
      <div className="[mask-image:linear-gradient(90deg,#000_88%,transparent)] sm:[mask-image:none]">
        <div
          ref={listRef}
          role="tablist"
          aria-label={t.tablistLabel}
          onKeyDown={onTabKeyDown}
          className="no-scrollbar relative flex gap-2 overflow-x-auto px-1 pt-1 pb-3 sm:flex-wrap sm:justify-center sm:overflow-visible"
        >
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 origin-top-left rounded-full bg-linear-to-r from-primary to-violet shadow-[0_8px_20px_-8px_rgba(74,68,214,0.7)] ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
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
                className={`relative z-[1] min-h-10 flex-none cursor-pointer appearance-none rounded-full px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none ${
                  selected
                    ? `text-white ring-1 ring-transparent ${ready ? 'bg-transparent' : 'bg-primary'}`
                    : 'bg-white/70 text-tab ring-1 ring-line backdrop-blur hover:text-primary hover:ring-primary-line-hover'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(active.id)} className="mt-2">
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
          className="glass overflow-hidden rounded-[24px] shadow-glow ring-1 ring-line/70 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary-line-hover"
        >
          <input type="hidden" name="tool" value={active.id} />
          {/* The ::after copy sizes the field from the full placeholder (or value), so the
              box never jumps while the placeholder types out. */}
          <div
            data-full={value || active.placeholder}
            className="grid min-h-[104px] after:invisible after:col-start-1 after:row-start-1 after:px-5 after:pt-[22px] after:pb-2 after:text-[16px] after:leading-[1.6] after:whitespace-pre-wrap after:content-[attr(data-full)_'_'] sm:after:px-6"
          >
            <textarea
              ref={inputRef}
              name="q"
              rows={1}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              aria-label={fill(t.inputLabel, { tool: active.label })}
              className="col-start-1 row-start-1 resize-none overflow-hidden border-0 bg-transparent px-5 pt-[22px] pb-2 text-[16px] leading-[1.6] text-ink outline-none placeholder:text-subtle focus-visible:outline-none sm:px-6"
            />
          </div>

          <div role="group" aria-label={t.suggestionsLabel} className="flex flex-wrap gap-2 px-4 pb-4 sm:px-5">
            {active.chips.map((chip, i) => (
              <button
                key={`${active.id}-${chip}`}
                type="button"
                onClick={() => pickChip(chip)}
                className="hero-chip min-h-9 cursor-pointer rounded-full border border-primary-line bg-primary-tint/80 px-3 py-1.5 text-left text-[13px] text-primary transition-colors hover:border-primary-line-hover hover:bg-primary-tint"
                style={{ '--i': i } as CSSProperties}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line/60 bg-surface-2/70 px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <span
                role="img"
                aria-label={t.attachLabel}
                className="grid size-9 flex-none place-items-center rounded-[10px] border border-line bg-white text-muted"
              >
                <Plus aria-hidden="true" className="size-4" />
              </span>
              <span className="mono flex h-9 flex-none items-center gap-1.5 rounded-[10px] border border-line bg-white px-2.5 text-[12.5px] text-muted">
                <FileText aria-hidden="true" className="size-3.5" />
                {t.pdf}
              </span>
              <span
                title={t.sourceLabel}
                className="flex h-9 min-w-0 items-center gap-2 rounded-[10px] border border-line bg-white px-3 text-[13px] whitespace-nowrap text-ink"
              >
                <span aria-hidden="true" className="size-2 flex-none rounded-full bg-success shadow-[0_0_0_3px_rgba(47,163,107,0.18)]" />
                <span className="truncate">{t.source}</span>
                <ChevronDown aria-hidden="true" className="size-3.5 flex-none text-faint" />
              </span>
            </div>
            <button
              type="submit"
              aria-label={t.send}
              aria-disabled={workspaceUrl ? undefined : true}
              aria-describedby={workspaceUrl ? undefined : soonId}
              title={workspaceUrl ? undefined : t.sendSoon}
              className="btn-primary size-10 flex-none cursor-pointer rounded-full border-0 active:scale-95 aria-disabled:cursor-default motion-reduce:transition-none"
            >
              <ArrowUp aria-hidden="true" className="size-[18px]" />
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
