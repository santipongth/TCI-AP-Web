'use client';

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from './use-reduced-motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Sliding background for the active tab, animated FLIP-style with transform only.
 * Works when tabs wrap onto several rows (it moves on both axes).
 * Until `ready`, the active tab paints its own background (SSR / no-JS look).
 */
export function useTabIndicator(listRef: RefObject<HTMLElement | null>, activeIndex: number) {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const last = useRef<Box | null>(null);
  const active = useRef(activeIndex);
  const [ready, setReady] = useState(false);

  const measure = (): Box | null => {
    const tab = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[active.current];
    return tab ? { left: tab.offsetLeft, top: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight } : null;
  };

  const place = (el: HTMLSpanElement, box: Box) => {
    el.style.transition = 'none';
    el.style.width = `${box.width}px`;
    el.style.height = `${box.height}px`;
    el.style.transform = `translate(${box.left}px, ${box.top}px)`;
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
      place(el, box);
      el.style.transform = `translate(${prev.left}px, ${prev.top}px) scale(${prev.width / box.width}, ${prev.height / box.height})`;
      void el.getBoundingClientRect();
      el.style.transition = 'transform 300ms var(--ease-out-soft)';
      el.style.transform = `translate(${box.left}px, ${box.top}px)`;
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
