'use client';

import { useEffect, useRef, useState } from 'react';
import { splitGraphemes } from '@/lib/graphemes';
import { prefersReducedMotion } from './use-reduced-motion';

const MAX_STEPS = 45;

/**
 * Types `text` out whenever it changes (never on first render, so SSR shows the
 * full string). Splits by grapheme so Thai vowels and tone marks never dangle.
 */
export function useTypewriter(text: string, { totalMs = 900 } = {}): string {
  const [shown, setShown] = useState(text);
  const previous = useRef(text);

  useEffect(() => {
    if (previous.current === text) return;
    previous.current = text;
    if (prefersReducedMotion()) {
      setShown(text);
      return;
    }
    const parts = splitGraphemes(text);
    const steps = Math.min(MAX_STEPS, parts.length);
    const perStep = Math.ceil(parts.length / steps);
    let step = 0;
    setShown('');
    const id = window.setInterval(() => {
      step += 1;
      const count = Math.min(parts.length, step * perStep);
      setShown(parts.slice(0, count).join(''));
      if (count >= parts.length) window.clearInterval(id);
    }, totalMs / steps);
    return () => window.clearInterval(id);
  }, [text, totalMs]);

  return shown;
}
