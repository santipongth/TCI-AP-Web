/**
 * Deep link into the Agentic Workspace: `${base}?tool=<id>&q=<text>`.
 * Returns null while the Workspace URL is undecided (README open item #2).
 */
export function buildWorkspaceHref(base: string | undefined, tool: string, q: string): string | null {
  const root = base?.trim();
  if (!root) return null;
  const url = new URL(root);
  url.searchParams.set('tool', tool);
  const question = q.trim();
  if (question) url.searchParams.set('q', question);
  return url.toString();
}
