'use client';

import { useEffect, useRef } from 'react';
import { useScenePhase } from '@/components/motion/Scene';

interface Props {
  to: number;
  /** Delay after the scene starts playing, ms. */
  at?: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  /** Thousands separators (1,284). */
  group?: boolean;
}

const nf = new Intl.NumberFormat('en-US');

/**
 * A number that counts up when its scene plays. The final text is always the
 * sizing layer, so the width never changes and screen readers read the real value.
 */
export function CountUp({ to, at = 0, dur = 900, prefix = '', suffix = '', group = false }: Props) {
  const phase = useScenePhase();
  const live = useRef<HTMLSpanElement>(null);
  const format = (n: number) => `${prefix}${group ? nf.format(n) : n}${suffix}`;
  const final = format(to);

  useEffect(() => {
    const el = live.current;
    if (!el) return;
    if (phase === 'final') {
      el.textContent = final;
      return;
    }
    el.textContent = format(0);
    if (phase !== 'play') return;

    let raf = 0;
    const timer = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = format(Math.round(to * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, at);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // format is derived from the primitive props listed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, to, at, dur, prefix, suffix, group, final]);

  return (
    <span className="inline-grid tabular-nums">
      <span className="col-start-1 row-start-1 opacity-0">{final}</span>
      <span ref={live} aria-hidden="true" className="col-start-1 row-start-1">
        {final}
      </span>
    </span>
  );
}
