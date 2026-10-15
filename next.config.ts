import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** The hero form submits (GET) to the Workspace, so CSP form-action must allow its origin. */
function workspaceOrigin(): string {
  const url = process.env.NEXT_PUBLIC_WORKSPACE_URL?.trim();
  if (!url) return '';
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

/*
 * CSP: the pages are static/ISR, so nonces are not available and Next's own inline
 * RSC scripts cannot be hashed; 'unsafe-inline' for scripts is the practical floor.
 * Everything else is first-party (fonts are self-hosted by next/font, logos are local).
 * Dev mode needs eval for React Refresh, so the CSP is production-only.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  `form-action 'self' ${workspaceOrigin()}`.trim(),
].join('; ');

const securityHeaders = [
  // Browsers ignore HSTS over plain HTTP, so this is safe for local `next start`.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  ...(process.env.NODE_ENV === 'production' ? [{ key: 'Content-Security-Policy', value: csp }] : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained server bundle for the Docker image (node .next/standalone/server.js).
  output: 'standalone',
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
