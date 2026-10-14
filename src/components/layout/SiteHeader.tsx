'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

interface Props {
  otherLocale: string;
  ctaHref: string;
  thaijoHref: string;
  t: {
    brand: string;
    tagline: string;
    homeLabel: string;
    menuLabel: string;
    tools: string;
    architecture: string;
    how: string;
    faq: string;
    thaijo: string;
    cta: string;
    switchTo: string;
    switchLabel: string;
  };
}

const STICKY = '(min-width: 768px)';

/**
 * Reference nav. From md up it sticks to the top, turns translucent once the page
 * scrolls and shows a 2px reading-progress bar; at scrollY = 0 it is pixel-identical
 * to the design. Below md it wraps onto several rows, so it stays static.
 */
export function SiteHeader({ otherLocale, ctaHref, thaijoHref, t }: Props) {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const root = document.documentElement;
    const mql = window.matchMedia(STICKY);
    const cssProgress = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');

    const syncHeight = () => {
      root.style.setProperty('--header-h', mql.matches ? `${header.offsetHeight}px` : '0px');
    };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        header.toggleAttribute('data-scrolled', window.scrollY > 4);
        if (!cssProgress && bar.current) {
          const max = root.scrollHeight - window.innerHeight;
          bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        }
      });
    };

    const ro = new ResizeObserver(syncHeight);
    ro.observe(header);
    mql.addEventListener('change', syncHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    syncHeight();
    onScroll();
    return () => {
      ro.disconnect();
      mql.removeEventListener('change', syncHeight);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      root.style.removeProperty('--header-h');
    };
  }, []);

  const navLink = 'text-strong hover:text-ink';

  return (
    <header
      ref={ref}
      className="section-x relative z-40 flex flex-wrap items-center justify-between gap-6 border-b border-divider bg-white py-[18px] transition-[background-color,backdrop-filter] duration-300 md:sticky md:top-0 md:data-scrolled:bg-white/85 md:data-scrolled:backdrop-blur-md"
    >
      <a href="#top" aria-label={t.homeLabel} className="flex items-center gap-[10px] text-ink hover:no-underline">
        <span className="grid size-[30px] place-items-center rounded-[8px] bg-primary text-[15px] font-bold text-white">T</span>
        <span className="flex flex-col leading-[1.1]">
          <span className="text-[16px] font-semibold">{t.brand}</span>
          <span className="mono text-[11px] tracking-[0.04em] text-muted">{t.tagline}</span>
        </span>
      </a>

      <nav aria-label={t.menuLabel} className="flex flex-wrap gap-7 text-[14px] text-strong">
        <a href="#tools" className={navLink}>
          {t.tools}
        </a>
        <a href="#architecture" className={navLink}>
          {t.architecture}
        </a>
        <a href="#how" className={navLink}>
          {t.how}
        </a>
        <a href="#faq" className={navLink}>
          {t.faq}
        </a>
      </nav>

      <div className="flex items-center gap-[10px]">
        <Link
          href={`/${otherLocale}`}
          hrefLang={otherLocale}
          lang={otherLocale}
          aria-label={t.switchLabel}
          className="mono rounded-full border border-line px-[10px] py-[5px] text-[12px] text-strong transition-colors hover:border-primary-line-hover hover:text-primary hover:no-underline"
        >
          {t.switchTo}
        </Link>
        <a href={thaijoHref} className="px-3 py-[9px] text-[14px] text-strong">
          {t.thaijo}
        </a>
        <a
          href={ctaHref}
          onClick={() => track({ name: 'cta_click', location: 'nav' })}
          className="rounded-full bg-primary px-[18px] py-[10px] text-[14px] font-medium text-white transition-colors duration-200 hover:bg-primary-hover hover:no-underline"
        >
          {t.cta}
        </a>
      </div>

      <span
        ref={bar}
        aria-hidden="true"
        className="scroll-progress pointer-events-none absolute inset-x-0 -bottom-px hidden h-[2px] origin-left bg-primary md:block"
      />
    </header>
  );
}
