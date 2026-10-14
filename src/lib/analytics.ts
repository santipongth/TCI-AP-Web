/**
 * Analytics events from README open item #6. No vendor is chosen yet, so events go
 * to `window.dataLayer` when a tag manager provides one and are dropped otherwise.
 */
export type AnalyticsEvent =
  | { name: 'tab_change'; tool: string }
  | { name: 'chip_click'; tool: string; chip: string }
  | { name: 'cta_click'; location: 'nav' | 'hero_submit' }
  | { name: 'faq_open'; index: number };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  window.dataLayer?.push({ event: `tci_${event.name}`, ...event });
}
