import type { CSSProperties, ReactNode } from 'react';
import type { HeroPattern } from '@/config/site';

const FADE_MASK = '[mask-image:linear-gradient(180deg,#000_30%,transparent_95%)]';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

interface Props {
  pattern: HeroPattern;
  t: { eyebrow: string; titleLine1: string; titleLine2: string; leadEn: string; body: string };
  demo: ReactNode;
}

/** Hero (README › 2). The intro is CSS-only so it plays from first paint; the H1 starts ≤120 ms. */
export function Hero({ pattern, t, demo }: Props) {
  return (
    <section id="top" className="section-x relative overflow-hidden pt-24 pb-[72px] text-center">
      {pattern === 'dots' && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-[radial-gradient(#d6d6dc_1px,transparent_1.2px)] bg-size-[22px_22px] ${FADE_MASK}`}
        />
      )}
      {pattern === 'grid' && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-[linear-gradient(#ebebef_1px,transparent_1px),linear-gradient(90deg,#ebebef_1px,transparent_1px)] bg-size-[44px_44px] ${FADE_MASK}`}
        />
      )}

      <div className="relative mx-auto flex max-w-[860px] flex-col items-center gap-[22px]">
        <div className="hero-in mono inline-flex items-center gap-2 text-[12px] tracking-[0.08em] text-primary uppercase" style={d(0)}>
          <span aria-hidden="true" className="hero-ping size-2 rounded-full bg-primary" />
          {t.eyebrow}
        </div>
        <h1 className="m-0 text-h1">
          <span className="hero-in block" style={d(60)}>
            {t.titleLine1}
          </span>
          <span className="hero-in block" style={d(180)}>
            {t.titleLine2}
          </span>
        </h1>
        <p className="hero-in m-0 max-w-[640px] text-[18px] leading-[1.55] text-body" style={d(300)}>
          {t.leadEn}
        </p>
        <p className="hero-in m-0 max-w-[680px] text-[15px] leading-[1.7] text-muted" style={d(380)}>
          {t.body}
        </p>
      </div>

      <div className="hero-in relative" style={d(480)}>
        {demo}
      </div>
    </section>
  );
}
