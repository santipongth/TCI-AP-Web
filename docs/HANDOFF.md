# Handoff: TCI AI Landing Page

## Overview
A bilingual (Thai-first, English sub-lines) landing page for the **TCI AI research team** that shows its AI tools for Thai scholarly journals (ThaiJO / TCI). The audiences are authors/researchers and funders/executives (TCI, NECTEC, NSTDA). The page is a **research showcase**. It covers 6 flagship tools, 6 supporting tools, 6 proposed concepts, the system architecture, a 4-step flow, an FAQ, and a partner footer.

## About the Design Files
The files in `design/` are **design references built in HTML**. They are prototypes that show the intended look, copy and behaviour. They are **not production code to copy**. The task is to **recreate this design in a production codebase**. The target repo (`TCI-AP-Web`) is currently empty, so use the recommended stack below unless the team already has one.

To view the reference, open `design/TCI AI Landing Page.dc.html` in a browser. Keep `support.js` next to it. All styles are inline in that file, and it is the source of truth for every string, colour and measurement.

### Recommended stack
- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**
- **next-intl** for TH/EN routing (`/th`, `/en`). Thai is the default. Strings live in JSON (see `content/`).
- **next/font/google**: IBM Plex Sans Thai (400/500/600/700) and IBM Plex Mono (400/500)
- Mostly static (SSG). Use ISR (revalidate about 1h) for live ThaiJO stats.
- Topic map: use `d3-force` or `sigma.js` with real topic-model data, or ship a static SVG for v1.

## Fidelity
**High-fidelity.** Recreate colours, type, spacing, radii and copy exactly. Product mockups inside feature rows are illustrative. Grey bars stand in for text lines. Build them as static, non-interactive React components (or export them as SVG) at the same proportions.

## Page Structure
Page wrapper: `max-width:1320px; margin:0 auto; background:#fff`. Content container in each section: `max-width:1120px; margin:0 auto`. Section horizontal padding: `40px` (reduce to 20px under 640px).

| # | Section | id | Vertical padding |
|---|---|---|---|
| 1 | Nav (header) | — | 18px |
| 2 | Hero + demo box | `top` | 96px top / 72px bottom |
| 3 | Tools (6 flagship rows + 6 cards) | `tools` | 88px top / 40px bottom |
| 4 | Proposed (toggleable) | `proposed` | 88px, top+bottom border `#ededf0` |
| 5 | Architecture | `architecture` | 96px |
| 6 | How it works | `how` | 72px / 96px, top border |
| 7 | FAQ | `faq` | 96px, top border |
| 8 | Footer | — | 56px / 40px, top border |

### 1. Nav
- Flex, space-between, gap 24, wraps. Bottom border `1px #ededf0`.
- Logo: a 30×30 square, radius 8, bg `#4a44d6`, white bold "T" at 15px. Next to it, "TCI AI" (16/600) above "RESEARCH TOOLS" (mono 11px, letter-spacing .04em, `#6b6b75`). **Replace with the official logo when it is available.**
- Links (14px, `#3c3c45`, gap 28): เครื่องมือ → #tools · สถาปัตยกรรม → #architecture · วิธีทำงาน → #how · คำถามที่พบบ่อย → #faq
- Right side: "ThaiJO ↗" text link to https://www.tci-thaijo.org/, plus a primary pill CTA "ทดลองใช้ Workspace" (14/500, bg `#4a44d6` → hover `#3b35b8`, padding 10×18, radius 999). **The CTA URL is TBD** (Workspace app).

### 2. Hero
- Background pattern behind the content. It is a prop: `dots` (default) | `grid` | `none`.
  - dots: `radial-gradient(#d6d6dc 1px, transparent 1.2px)` at 22px, masked `linear-gradient(180deg,#000 30%,transparent 95%)`
  - grid: 1px `#ebebef` lines at 44px, same mask
- Centred column, max-width 860, gap 22:
  - Eyebrow: mono 12px, .08em, uppercase, `#4a44d6`, with an 8px dot: "TCI AI Research · built on ThaiJO"
  - H1: `clamp(36px,5.2vw,60px)` / 1.15 / 600 / -0.02em: "AI สำหรับวารสารวิชาการไทย" (line break) "ตั้งแต่ค้นคว้าจนถึงตีพิมพ์"
  - EN lead: 18px / 1.55 / `#4a4a54`, max-width 640
  - TH body: 15px / 1.7 / `#6b6b75`, max-width 680
- **Demo box** (max-width 860, margin-top 44):
  - Tab row: 8 buttons (13.5/500, padding 12×16, radius `10px 10px 0 0`). Active tab: bg `#4a44d6`, text white. Inactive: transparent, `#5c5c66`. The row scrolls horizontally on overflow.
  - Card: white, border `1px #e3e3e8`, radius 16, shadow `0 20px 60px -30px rgba(23,23,28,.25)`
    - Placeholder text area: min-height 96, padding `22px 24px 8px`, 15.5/1.6, `#8a8a94`
    - Suggestion chips: 12.5px, `#4a44d6` on `#eeedfc`, border `#dcdaf7`, radius 999, padding 5×10
    - Footer bar (`#fbfbfc`, top border `#f0f0f3`): "+" button 32×32, a "PDF" mono chip, a source selector "● TCI MCP Gateway ▾", and on the right a 36×36 round send button in `#4a44d6`
  - Tab data is in `content/hero-tabs.th.json`. Production: make the placeholder a real `<textarea>`. Submit (or a chip click) deep-links to the Workspace with `?tool=<id>&q=<text>`.

### 3. Tools
Header (centred, max-width 720, margin-bottom 72):
- Eyebrow: "Tools · เครื่องมือที่พร้อมทดลองใช้"
- H2: "ออกแบบจากวิธีที่นักวิจัยไทยทำงานจริง"
- Lead: "Built for how Thai research actually gets done. …" (16/1.7 `#6b6b75`)

**Flagship rows.** Each row is `grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap:48px; align-items:center; padding:36px 0`. The mockup and the text alternate sides:

| Row | Badge | Title | Mockup side |
|---|---|---|---|
| 1 | 01 · FLAGSHIP | Agentic Workspace | left |
| 2 | 02 · FLAGSHIP | Research Assistant | right |
| 3 | 03 · AUTHORS & EDITORS | Reference Extraction & Validation | left |
| 4 | 04 · AUTHORS | Deep Research | right |
| 5 | 05 · OUTREACH | Paper Explainer | left (dark mockup) |
| 6 | 06 · DISCOVERY | Research Atlas | right |

- Text column (max-width 440, gap 14):
  - Badge: mono 11px, .06em, `#4a44d6` on `#eeedfc`, padding 4×8, radius 6
  - H3: 26/600/-0.01em
  - Paragraph: 15/1.75 `#4a4a54`
  - 3 bullets: 14px `#3c3c45`, gap 8, each with a 6px `#4a44d6` dot
- Mockup frame: white, border `#e3e3e8`, radius 14, `overflow:hidden`, shadow `0 24px 50px -32px rgba(23,23,28,.3)`, base font 12px.
  - Row 5 is dark: bg `#17171c`, border `#2a2a33`, inner panel `#0f0f14`, lines `#34343e`, accent `#7c76ff` / `#c8c6ff`, shadow alpha .6.
- What each mockup must show:
  1. **Workspace:** a "Connected MCPs" sidebar (150px) with ThaiJO Search, Article, Journal, Author, Citation and Scholarly MCP, plus "+ register skill". Next to it, a chat: the user bubble, then an agent trace in mono (plan → subagent calls → re-plan → synthesize), then an answer with citation chips.
  2. **Research Assistant:** source toggles (ThaiJO / OpenAlex / PubMed), the question bubble, a retrieval line, an answer with inline citation markers, an evidence-confidence pill, 3 source rows (number · database tag · meta · evidence type), and follow-up chips including "→ ส่งไป Deep Research". Database tag colours: ThaiJO `#1f7a4d`/`#e4f5ec`, PubMed `#1f5aa6`/`#e3eefb`, OpenAlex `#8a5a00`/`#fdf0d0`.
  3. **Reference Extraction:** file chip "manuscript_v3.pdf", "28 / 32 verified", and 5 rows whose statuses are Verified·DOI, Verified·ThaiJO, a ⚠ year mismatch (warn row bg `#fffaf0`), ✕ Retracted, and ✕ not found (error row bg `#fff5f5`). Buttons: "แก้ไขอัตโนมัติ 2 รายการ" and "Export BibTeX / RIS".
  4. **Deep Research:** a "Research plan" sidebar (170px) with step states done ✓ (`#2fa36b`), running … (`#4a44d6`) and pending (outline). Next to it, a report draft with citation chips and a reference list. Years: Thai sources in พ.ศ., international sources in ค.ศ.
  5. **Paper Explainer:** the article column with a highlighted paragraph, plus a Manim scene panel showing the equation `∂C/∂t = D∇²C − v·∇C` and a progress bar.
  6. **Research Atlas:** a toolbar, a network graph (SVG, viewBox 520×340, 5 clusters), a side panel for the selected topic (TOPIC 05: stats, keywords, linked topics T23 and T43), and a legend.
     - Cluster colours: สาธารณสุข `#8f5ef0`, เกษตรและอาหาร `#e0554f`, วิศวกรรม `#3a74d6`, ศึกษาศาสตร์ `#37a862`, สังคมศาสตร์ `#b89a1f`.
     - Production: generate from real topic data. The prototype uses a seeded random layout (`topicGraph()` in the logic class).

**Tool cards.** Grid `repeat(auto-fit,minmax(280px,1fr))`, gap 16, margin-top 48. Six cards: AI Chatbot (CB), Reviewer Finder (RF), Literature Review Tool (LR), Journal Finder (JF), Author Finder (AF), Emerging Themes (ET).
- Card: white, border `#e3e3e8` (hover `#c9c7f0`), radius 14, padding 22, gap 10
- Monogram: 38×38, radius 10, `#eeedfc` bg, `#4a44d6` mono 12/500
- Title: 17/600
- Body: 14/1.7 `#6b6b75`

### 4. Proposed (`showProposed`, default true)
- Two-column header: eyebrow "Proposed · แนวคิดเพิ่มเติม", H2 "เครื่องมือในอนาคต", and a lead paragraph on the right.
- Six dashed cards (border `1px dashed #cfcfd6`). Each has a "CONCEPT" mono tag and an audience pill: บรรณาธิการ `#8a5a00`/`#fdf0d0`, ผู้เขียน `#1f5aa6`/`#e3eefb`.
- The concepts:
  - Similarity & AI-text Detection
  - TH↔EN Abstract Translator & Academic Polishing
  - Thai Citation Style Formatter
  - Metadata & Keyword Enrichment
  - Citation Recommender
  - Submission Pre-check

### 5. Architecture
Header (centred): eyebrow "Architecture · สถาปัตยกรรม", H2 "Agent เดียว เชื่อมถึงข้อมูลวารสารไทยทั้งระบบ", and a lead paragraph.

The diagram sits inside `overflow-x:auto`. Its inner `min-width:1000px` is required on mobile, which scrolls horizontally. A stacked mobile layout is an acceptable alternative. Grid columns: `1fr 26px 1.2fr 26px 1.2fr 26px 1fr 26px 1fr`. The 26px columns hold "⇄" arrows (`#b0b0b9`, 16px).
- Lane header: mono 10.5px, .08em, `#6b6b75`, bottom border
- Standard box: white, border `#e3e3e8`, radius 12, padding 12×14. Title 13.5/600, description 11.5 `#6b6b75`.
- Data boxes: bg `#f7f7f5`
- Dashed "extensible" boxes: `1px dashed #b9b9c2`

| Lane | Contents |
|---|---|
| 01 · CLIENTS | Agentic Workspace · Users (login via ThaiJO or ORCID; chips: ผู้เขียน, บรรณาธิการ, ผู้ประเมิน, นักศึกษา / ผู้อ่าน) · AI Chatbot (FAQ) — web + LINE OA, no access to research content · Editor Console · OJS plugin |
| 02 · ORCHESTRATION | **AI Agent Orchestrator** (bg `#4a44d6`, bullets `#dcdaf7` with `#aaa6ff` dots): Planning, Routing, Subagents, Re-planning, Synthesis, Memory, Human-in-the-loop · Skills chip cloud (11 skills + "+ new") · LLM Router: Pathumma LLM (NECTEC), Typhoon (SCB 10X), OpenThaiGPT + international models |
| 03 · GATEWAY | **TCI MCP Gateway & Registry** (bg `#17171c`, bullets `#c4c4cc`): Registry (+A2A), Access control (OAuth 2.1, ThaiJO SSO, RBAC), Protocol bridge (MCP ↔ OJS REST API, OAI-PMH), Rate limiting · caching · audit log · "+ Register" dashed box |
| 04 · MCP SERVERS | ThaiJO Search · Article · Journal · Author · Citation · Editorial (editor-only) · Scholarly (OpenAlex, Crossref, PubMed, ORCID) · Partner MCPs (dashed) |
| 05 · DATA | ThaiJO (OJS) stats · ThaiJO / TCI Knowledge Base · TCI Citation Index (tiers 1–3, Round 5: 2568–2572, T-JIF) · ACI · Search & Embedding Index · OpenAlex · Crossref · PubMed · ORCID (incl. Retraction Watch) |

Two full-width bars sit below the lanes:
- **INGESTION PIPELINE** (bg `#f7f7f5`)
- **CROSS-CUTTING** (dashed)

Their item lists are in the HTML.

### 6. How it works
- Eyebrow, then H2 "สี่ขั้นตอนจากคำถามถึงคำตอบที่ตรวจสอบได้"
- Four step cards in a grid `minmax(230px,1fr)`, gap 16
- Step card: top border `2px #4a44d6`, other borders `1px #ededf0`, radius `0 0 12px 12px`, padding 22
- Step number: mono 12px `#4a44d6`. Title: 16/600. Body: 14/1.7.

### 7. FAQ
- Two columns (`minmax(300px,1fr)`, gap 48)
- Left: eyebrow, H2 "คำถามจากผู้เขียนและบรรณาธิการ", and a contact line linking to ThaiJO
- Right: an accordion with 8 items. Data is in `content/faq.th.json`.
  - Row: bottom border `#e3e3e8`. Question button 16/500, padding 18 0, "+"/"−" icon 20px `#4a44d6`.
  - Answer: 14.5/1.75 `#4a4a54`, padding `0 40px 18px 0`
  - Only one item is open at a time. The first item is open on load. Clicking the open item closes it.

### 8. Footer
- Label "พัฒนาโดย · Developed by" (mono 11.5, uppercase, `#8a8a94`)
- Three logo slots, each 200×72 with radius 10: **TCI, NECTEC, NSTDA**. They are currently striped placeholders; replace them with the official logos.
- Under the logos, the full Thai organisation names (13px `#6b6b75`)
- Bottom row (top border): "© 2026 TCI AI Research Team" and links to ThaiJO, TCI, NECTEC, NSTDA and Agenta AI:
  - https://www.tci-thaijo.org/
  - https://tci-thailand.org/
  - https://www.nectec.or.th/
  - https://www.nstda.or.th/
  - https://agenta.ai/

## Interactions & Behavior
- **Hero tabs:** clicking a tab sets the active tool. That swaps the placeholder and the chips instantly (no animation). The initial tab comes from the `defaultTool` prop and falls back to the first tab. Ids: `workspace`, `assistant`, `refs`, `deep`, `explainer`, `topics`, `themes`, `chatbot`. Implement with `role="tablist"`/`tab`, `aria-selected`, and arrow-key navigation.
- **FAQ:** single-open accordion. Use `<button aria-expanded>` and `aria-controls`. An optional height transition of 200ms ease-out is fine.
- **Hover:**
  - Nav CTA background changes to `#3b35b8`
  - Tool card borders change to `#c9c7f0`
  - Links: `a { color:#4a44d6 }`, underline on hover
- **Anchor nav:** smooth-scroll to section ids. Offset by the header height if the header becomes sticky.
- **Responsive:** every multi-column grid uses `auto-fit,minmax(...)`, so it collapses to a single column naturally. On a single column, always put the flagship text above its mockup (use `order` so the text comes first). Headings use `clamp()`. The architecture diagram scrolls horizontally.
- `prefers-reduced-motion`: there are no animations currently. Keep it that way, or gate any you add behind it.

## State
- `activeTool: ToolId` (hero)
- `openFaq: number | -1`
- Props/config: `heroPattern: 'dots'|'grid'|'none'`, `defaultTool: ToolId`, `showProposed: boolean`
- **Data fetching:** ThaiJO stats (journals 1,858 · issues 39,307 · articles 423,394 · authors 536,878, as shown on tci-thaijo.org in Oct 2026) are hardcoded in several places: the Tools lead, the Research Atlas bullet, Author Finder, and the Data lane. Fetch them from the ThaiJO statistics API (ISR), format with `Intl.NumberFormat('th-TH')`, and keep the hardcoded values as fallback.

## Design Tokens
**Colours**

| Token | Hex |
|---|---|
| ink / dark surface | `#17171c` |
| text-strong | `#3c3c45` |
| text-body | `#4a4a54` |
| text-muted | `#6b6b75` |
| text-subtle | `#8a8a94` |
| text-faint | `#9a9aa4` |
| tab-inactive | `#5c5c66` |
| border | `#e3e3e8` |
| divider | `#ededf0` |
| hairlines | `#eeeef1`, `#f0f0f3`, `#f3f3f5` |
| surface-1 | `#fafafb` |
| surface-2 | `#fbfbfc` |
| bubble | `#f4f4f6` |
| data-bg | `#f7f7f5` |
| skeleton | `#dcdce2`, `#ececf0` |
| primary | `#4a44d6` |
| primary-hover | `#3b35b8` |
| primary-tint | `#eeedfc` |
| primary-tint-border | `#dcdaf7` |
| primary-border-hover | `#c9c7f0` |
| primary-on-dark | `#dcdaf7` |
| primary-dot-on-dark | `#aaa6ff` |
| dark-border | `#2a2a33` |
| dark-inset | `#0f0f14` |
| dark-line | `#34343e` |
| violet | `#7c76ff`, `#c8c6ff` |
| success | `#2fa36b`, ink `#1f7a4d`, bg `#e4f5ec` |
| warning | ink `#8a5a00`, bg `#fdf0d0`, row `#fffaf0` |
| error | ink `#a12a2a`, bg `#fde2e2`, row `#fff5f5` |
| info | ink `#1f5aa6`, bg `#e3eefb` |
| dashed borders | `#cfcfd6`, `#b9b9c2`, `#d9d9df` |
| arrow | `#b0b0b9` |

**Typography**
- Sans: IBM Plex Sans Thai. Mono: IBM Plex Mono. Global `text-wrap: pretty`; antialiased.
- H1 `clamp(36,5.2vw,60)`/1.15/600/-.02em
- H2 `clamp(28,3.6vw,40)`/1.2/600/-.015em
- H3 26/600/-.01em
- Card title 17/600; step title 16/600
- Lead 18/1.55 · 16/1.7; feature body 15/1.75; list and card body 14/1.7; FAQ answer 14.5/1.75
- Eyebrow: mono 12 uppercase .08em; badge: mono 11 .06em; lane header: mono 10.5 .08em
- Mockup text: 10–13.5

**Radii:** 999 (pills) · 16 (demo box) · 14 (cards, mockups) · 12 (architecture boxes) · 10 (tabs, monograms, logo slots) · 8 · 6 · 5 · 4 · 3

**Shadows**
- Demo box: `0 20px 60px -30px rgba(23,23,28,.25)`
- Mockups: `0 24px 50px -32px rgba(23,23,28,.3)` (dark mockup: `.6`)

**Spacing:** section padding-y 72–96 · feature row gap 48 / padding-y 36 · grid gap 16 · card padding 22 · header margin-bottom 56–72 · text stack gap 12–14

## Assets
- **Logos:** TCI, NECTEC and NSTDA are **not included**. Get the official files from each organisation's brand team and follow their usage rules.
- **Icons:** none. Glyphs are Unicode (↗ ▾ ↑ → ⇄ ✓ ⚠ ✕ + −). Swap them for an icon set (e.g. Lucide) if preferred.
- **Fonts:** Google Fonts (IBM Plex Sans Thai, IBM Plex Mono)
- **Images:** none. All mockups are built from HTML/CSS plus one generated SVG.

## Content / i18n
- `content/hero-tabs.th.json` holds the hero tab labels, placeholders and chips.
- `content/faq.th.json` holds the 8 FAQ entries.
- All other copy is inline in the HTML reference. Move it into `messages/th.json` and translate it to `messages/en.json`. The page already pairs a short English sub-line with each Thai heading; keep that pattern in the TH locale.
- Product names (Agentic Workspace, Research Assistant, MCP names and so on) stay in English in both locales.

## Open items before launch
1. Official logos (TCI, NECTEC, NSTDA) and the TCI AI product mark
2. Real URLs for "ทดลองใช้ Workspace" and the demo-box submit
3. A live stats endpoint
4. Real topic-model data for Research Atlas
5. Legal sign-off on the FAQ data-use answer (PDPA)
6. Analytics events: tab change, chip click, CTA click, FAQ open
7. SEO and OpenGraph metadata (title: "TCI AI — AI สำหรับวารสารวิชาการไทย")

## Files
- `design/TCI AI Landing Page.dc.html`: the full design reference. Markup and inline styles are in `<x-dc>`. Tab and FAQ data and `topicGraph()` are in the `<script data-dc-script>` class at the bottom.
- `design/support.js`: the runtime needed to open the reference in a browser. It is not part of production.
- `content/*.json`: copy extracted from the design.
