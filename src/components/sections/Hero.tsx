import type { CSSProperties, ReactNode } from 'react';
import type { HeroPattern } from '@/config/site';

const FADE_MASK = '[mask-image:linear-gradient(180deg,#000_25%,transparent_85%)]';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

interface Props {
  pattern: HeroPattern;
  t: { eyebrow: string; titleLine1: string; titleLine2: string; leadEn: string; body: string };
  demo: ReactNode;
}

/**
 * Hero: static aurora (no looping motion), pill eyebrow, H1 with a gradient second
 * line, then the glass demo box. The intro is CSS-only so it plays from first paint.
 */
export function Hero({ pattern, t, demo }: Props) {
  return (
    <section id="top" className="section-x relative overflow-hidden pt-32 pb-20 text-center sm:pt-40 sm:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-22%] left-1/2 h-[680px] w-[min(1200px,150vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,118,255,0.28),transparent)]" />
        <div className="absolute top-[14%] left-[-6%] size-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(74,68,214,0.16),transparent)]" />
        <div className="absolute top-[4%] right-[-8%] size-[440px] rounded-full bg-[radial-gradient(closest-side,rgba(139,227,247,0.3),transparent)]" />
        {pattern === 'dots' && (
          <div className={`absolute inset-0 bg-[radial-gradient(#d6d6dc_1px,transparent_1.2px)] bg-size-[22px_22px] opacity-70 ${FADE_MASK}`} />
        )}
        {pattern === 'grid' && (
          <div
            className={`absolute inset-0 bg-[linear-gradient(#ebebef_1px,transparent_1px),linear-gradient(90deg,#ebebef_1px,transparent_1px)] bg-size-[44px_44px] ${FADE_MASK}`}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-white" />
      </div>

      <div className="relative mx-auto flex max-w-[920px] flex-col items-center gap-6">
        <div className="hero-in eyebrow shadow-[0_6px_20px_-12px_rgba(74,68,214,0.6)]" style={d(0)}>
          <span aria-hidden="true" className="hero-ping size-2 rounded-full bg-primary" />
          {t.eyebrow}
        </div>
        <h1 className="m-0 text-h1 [text-wrap:balance]">
          <span className="hero-in block" style={d(60)}>
            {t.titleLine1}
          </span>
          <span className="hero-in block" style={d(180)}>
            <span className="text-gradient">{t.titleLine2}</span>
          </span>
        </h1>
        <p className="hero-rise m-0 max-w-[660px] text-[17px] leading-[1.6] text-body sm:text-[19px]" style={d(300)}>
          {t.leadEn}
        </p>
        <p className="hero-rise m-0 max-w-[700px] text-[15px] leading-[1.75] text-muted" style={d(380)}>
          {t.body}
        </p>
      </div>

      <div className="hero-in relative" style={d(480)}>
        {demo}
      </div>
    </section>
  );
}
