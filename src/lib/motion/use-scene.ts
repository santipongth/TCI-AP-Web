'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './use-reduced-motion';

/**
 * final  the reference frame (SSR, no-JS, reduced motion, or visible on mount)
 * armed  the intro's starting frame; only ever applied while offscreen
 * play   the intro is running (CSS reads [data-scene='play'])
 */
export type ScenePhase = 'final' | 'armed' | 'play';

interface Options {
  /** Visible fraction that starts the intro. */
  threshold?: number;
}

export function useScene<T extends HTMLElement>({ threshold = 0.35 }: Options = {}) {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<ScenePhase>('final');

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const visible = entry.isIntersecting && entry.intersectionRatio > 0;
        if (first) {
          first = false;
          // Already on screen at mount (deep link, reload mid-page): keep the final frame.
          if (!visible) setPhase('armed');
          return;
        }
        if (!visible) setPhase('armed');
        else if (entry.intersectionRatio >= threshold) setPhase((p) => (p === 'armed' ? 'play' : p));
      },
      { threshold: [0, threshold] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, phase };
}
