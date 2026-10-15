# TCI AI: AI for Thai scholarly journals

Bilingual (Thai-first, English) landing page for the **TCI AI research team**. It presents AI tools built on ThaiJO and the Thai-Journal Citation Index (TCI): six flagship tools with live mockups, supporting tools, proposed concepts, the system architecture, a four-step flow and an FAQ.

เว็บไซต์แนะนำเครื่องมือ AI สำหรับวารสารวิชาการไทยของทีมวิจัย TCI AI (ภาษาไทยและอังกฤษ)

- `/` redirects to `/th`; `/en` is the English version.
- Developed by the TCI AI Research Team with TCI, NECTEC and NSTDA.

## Stack

- Next.js 15 (App Router, standalone output) · React 19 · TypeScript
- Tailwind CSS v4 with the design tokens in `src/app/globals.css`
- next-intl for `/th` and `/en` routing
- IBM Plex Sans Thai and IBM Plex Mono via `next/font`
- Vitest and Testing Library

## Getting started

Requires Node.js 22.12 or newer.

```bash
npm ci
npm run dev        # http://localhost:3000 → /th
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` · `npm run typecheck` · `npm test` | ESLint, `tsc --noEmit`, Vitest |
| `npm run check` | All of the above plus the build (what CI runs) |

Configuration lives in `.env` (copy `.env.example`). `NEXT_PUBLIC_SITE_URL` must be the public origin for a production build. See [DEPLOY.md](DEPLOY.md) for every variable, the Docker setup and the security headers.

## Where things live

| Path | Contents |
|---|---|
| `content/*.{th,en}.json` | Structured copy: hero tabs, tools, proposed concepts, architecture, steps, FAQ |
| `messages/{th,en}.json` | UI strings and page metadata |
| `src/components/sections/` | One component per page section |
| `src/components/mockups/` | The animated product mockups |
| `src/components/ui/BrandMark.tsx` | The TCI AI robot mark (SVG) |
| `src/app/` | Routes, metadata files (icons, OG image, robots, sitemap), global CSS |
| `docs/HANDOFF.md` | The original design handoff: layout, tokens, behaviour |
| `design/` | The HTML design reference from the handoff |

Edit copy in `content/` and `messages/`, always in both languages. Tests check that TH and EN keep the same keys, ids and placeholders, and they lock a few copy decisions (for example, at most six skills in the architecture diagram).

## Open items before launch

| # | Item | Status |
|---|---|---|
| 1 | Official logos (TCI, NECTEC, NSTDA) and the TCI AI product mark | Done in code. Confirm each organisation has approved its logo use |
| 2 | Real URLs for "ทดลองใช้ Workspace" and the demo-box submit | Open. Set `NEXT_PUBLIC_WORKSPACE_URL`; until then the CTA scrolls to the top and submit is disabled |
| 3 | A live stats endpoint | Open. Set `THAIJO_STATS_URL`; the October 2026 figures are used meanwhile |
| 4 | Real topic-model data for Research Atlas | Open. The map is a seeded illustration (`src/lib/topic-graph.ts`) |
| 5 | Legal sign-off on the FAQ data-use answer (PDPA) | Open |
| 6 | Analytics events: tab change, chip click, CTA click, FAQ open | Events are sent to `window.dataLayer`; no vendor yet. Adding one needs a CSP update and a PDPA consent notice |
| 7 | SEO and OpenGraph metadata | Done: titles, descriptions, canonical, hreflang, OG image, robots.txt, sitemap.xml |
| 8 | Production domain | Open. Required at build time as `NEXT_PUBLIC_SITE_URL` |

Content follow-ups: the text inside the product mockups is not localised yet (the EN page shows some Thai and vice versa).

## Deploy

One Docker container behind a TLS reverse proxy. See [DEPLOY.md](DEPLOY.md).

The TCI, NECTEC and NSTDA logos belong to their organisations; follow each organisation's brand rules when reusing them.
