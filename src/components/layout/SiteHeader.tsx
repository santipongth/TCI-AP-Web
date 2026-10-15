'use client';

import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { BrandMark, BrandName } from '@/components/ui/BrandMark';
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
    menuOpen: string;
    menuClose: string;
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

const DESKTOP = '(min-width: 1024px)';

/**
 * Floating glass navigation. From lg up the links sit inline; below that they move
 * into a disclosure panel (☰). A 2px reading-progress bar runs along the viewport top.
 */
export function SiteHeader({ otherLocale, ctaHref, thaijoHref, t }: Props) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const links = [
    ['#tools', t.tools],
    ['#architecture', t.architecture],
    ['#how', t.how],
    ['#faq', t.faq],
  ] as const;

  // Scroll state + JS fallback for the progress bar (CSS scroll timelines handle it where supported).
  useEffect(() => {
    const cssProgress = typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()');
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 8);
        if (!cssProgress && bar.current) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Close the menu on Escape and when the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const mql = window.matchMedia(DESKTOP);
    const onWide = () => {
      if (mql.matches) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    mql.addEventListener?.('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      mql.removeEventListener?.('change', onWide);
    };
  }, [open]);

  const langSwitch = (
    <Link
      href={`/${otherLocale}`}
      hrefLang={otherLocale}
      lang={otherLocale}
      aria-label={t.switchLabel}
      className="mono inline-flex h-9 items-center justify-center rounded-full border border-line bg-white/70 px-3 text-[12px] text-strong transition-colors hover:border-primary-line-hover hover:text-primary hover:no-underline"
    >
      {t.switchTo}
    </Link>
  );

  const thaijo = (
    <a href={thaijoHref} className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[14px] text-strong hover:text-primary hover:no-underline">
      {t.thaijo}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
  );

  const cta = (extra: string) => (
    <a
      href={ctaHref}
      onClick={() => {
        track({ name: 'cta_click', location: 'nav' });
        setOpen(false);
      }}
      className={`btn-primary h-10 rounded-full px-5 text-[14px] font-medium ${extra}`}
    >
      {t.cta}
    </a>
  );

  return (
    <>
      <span
        ref={bar}
        aria-hidden="true"
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-linear-to-r from-primary via-violet to-lilac"
      />
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div
          className={`glass mx-auto flex max-w-[1180px] items-center justify-between gap-4 rounded-[22px] py-2 pr-2 pl-4 transition-shadow duration-300 lg:rounded-full lg:pl-5 ${
            scrolled ? 'shadow-glass-raised' : ''
          }`}
        >
          <a href="#top" title={t.homeLabel} className="flex min-h-11 items-center gap-[10px] text-ink hover:no-underline">
            <BrandMark className="size-10 flex-none" />
            <span className="flex flex-col gap-[3px] leading-none">
              <span className="mono text-[17px] font-bold tracking-[-0.01em]">
                <BrandName name={t.brand} />
              </span>
              <span className="mono text-[9.5px] tracking-[0.16em] text-muted">{t.tagline}</span>
            </span>
          </a>

          <nav aria-label={t.menuLabel} className="hidden items-center gap-1 lg:flex">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3.5 py-2 text-[14px] text-strong transition-colors hover:bg-primary-tint/70 hover:text-primary hover:no-underline"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              {langSwitch}
              {thaijo}
            </div>
            {cta('hidden sm:inline-flex')}
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? t.menuClose : t.menuOpen}
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-white/80 text-ink transition-colors hover:border-primary-line-hover hover:text-primary lg:hidden"
            >
              {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </div>

        <div id={panelId} hidden={!open} className="glass mx-auto mt-2 max-w-[1180px] rounded-[22px] p-2 lg:hidden">
          <nav aria-label={t.menuLabel} className="flex flex-col">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-[14px] px-4 py-3 text-[15px] text-ink hover:bg-primary-tint/70 hover:text-primary hover:no-underline"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line px-2 pt-3 pb-1">
            {langSwitch}
            {thaijo}
            {cta('ml-auto inline-flex sm:hidden')}
          </div>
        </div>
      </header>
    </>
  );
}
