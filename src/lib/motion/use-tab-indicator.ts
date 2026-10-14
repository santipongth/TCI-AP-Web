'use client';

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from './use-reduced-motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Sliding background for the active tab, animated FLIP-style with transform only.
 * Until `ready`, the active tab paints its own background (SSR / no-JS look).
 */
export function useTabIndicator(listRef: RefObject<HTMLElement | null>, activeIndex: number) {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const last = useRef<{ left: number; width: number } | null>(null);
  const active = useRef(activeIndex);
  const [ready, setReady] = useState(false);

  const measure = () => {
    const tab = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[active.current];
    return tab ? { left: tab.offsetLeft, width: tab.offsetWidth } : null;
  };

  const place = (el: HTMLSpanElement, box: { left: number; width: number }) => {
    el.style.transition = 'none';
    el.style.width = `${box.width}px`;
    el.style.transform = `translateX(${box.left}px)`;
  };

  useIsoLayoutEffect(() => {
    active.current = activeIndex;
    const el = indicatorRef.current;
    const box = measure();
    if (!el || !box || box.width === 0) return;
    const prev = last.current;
    last.current = box;
    if (!prev || prefersReducedMotion()) {
      place(el, box);
    } else {
      // Invert to the previous box, then play to the new one.
      el.style.transition = 'none';
      el.style.width = `${box.width}px`;
      el.style.transform = `translateX(${prev.left}px) scaleX(${prev.width / box.width})`;
      void el.getBoundingClientRect();
      el.style.transition = 'transform 260ms var(--ease-out-soft)';
      el.style.transform = `translateX(${box.left}px)`;
    }
    setReady(true);
  }, [activeIndex]);

  // Re-measure without animation when fonts load or the row resizes (never on tab change,
  // which would cancel the slide).
  useEffect(() => {
    const list = listRef.current;
    const el = indicatorRef.current;
    if (!list || !el) return;
    const sync = () => {
      const box = measure();
      if (!box || box.width === 0) return;
      last.current = box;
      place(el, box);
      setReady(true);
    };
    const ro = new ResizeObserver(sync);
    ro.observe(list);
    document.fonts?.ready.then(sync).catch(() => {});
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { indicatorRef, ready };
}
