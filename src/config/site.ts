import type { ToolId } from '@/lib/content';

export type HeroPattern = 'dots' | 'grid' | 'none';

/** Page props from the prototype (README › State). */
export const siteConfig = {
  heroPattern: 'dots' as HeroPattern,
  defaultTool: 'workspace' as ToolId,
  showProposed: true,
  /** Agentic Workspace app (README open item #2). Unset: CTA scrolls to the demo, submit is inert. */
  workspaceUrl: process.env.NEXT_PUBLIC_WORKSPACE_URL?.trim() || undefined,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000',
  links: {
    thaijo: 'https://www.tci-thaijo.org/',
    tci: 'https://tci-thailand.org/',
    nectec: 'https://www.nectec.or.th/',
    nstda: 'https://www.nstda.or.th/',
  },
};
