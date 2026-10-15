import type { ToolId } from '@/lib/content';

export type HeroPattern = 'dots' | 'grid' | 'none';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
// Canonical, hreflang, og:url, robots and sitemap are baked in at build time.
// The Docker build refuses to run without it; a bare `next build` only warns.
if (!siteUrl && process.env.NODE_ENV === 'production') {
  console.warn('[site] NEXT_PUBLIC_SITE_URL is not set: canonical and OpenGraph URLs will point to http://localhost:3000');
}

/** Page props from the prototype (docs/HANDOFF.md › State). */
export const siteConfig = {
  heroPattern: 'dots' as HeroPattern,
  defaultTool: 'workspace' as ToolId,
  showProposed: true,
  /** Agentic Workspace app (README open item #2). Unset: CTA scrolls to the demo, submit is inert. */
  workspaceUrl: process.env.NEXT_PUBLIC_WORKSPACE_URL?.trim() || undefined,
  siteUrl: siteUrl || 'http://localhost:3000',
  links: {
    thaijo: 'https://www.tci-thaijo.org/',
    tci: 'https://tci-thailand.org/',
    nectec: 'https://www.nectec.or.th/',
    nstda: 'https://www.nstda.or.th/',
  },
};
