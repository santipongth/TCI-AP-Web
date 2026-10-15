import architectureEn from '@content/architecture.en.json';
import architectureTh from '@content/architecture.th.json';
import faqEn from '@content/faq.en.json';
import faqTh from '@content/faq.th.json';
import heroTabsEn from '@content/hero-tabs.en.json';
import heroTabsTh from '@content/hero-tabs.th.json';
import howEn from '@content/how.en.json';
import howTh from '@content/how.th.json';
import proposedEn from '@content/proposed.en.json';
import proposedTh from '@content/proposed.th.json';
import toolsEn from '@content/tools.en.json';
import toolsTh from '@content/tools.th.json';
import type { Locale } from '@/i18n/routing';

export const TOOL_IDS = ['workspace', 'assistant', 'refs', 'deep', 'explainer', 'topics', 'themes', 'chatbot'] as const;
export type ToolId = (typeof TOOL_IDS)[number];

export type FlagshipId = 'workspace' | 'assistant' | 'refs' | 'deep' | 'explainer' | 'atlas';

export interface HeroTab {
  id: ToolId;
  label: string;
  placeholder: string;
  chips: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Flagship {
  id: FlagshipId;
  badge: string;
  title: string;
  body: string;
  bullets: string[];
}

export interface ToolCard {
  mono: string;
  title: string;
  body: string;
}

export interface ProposedItem {
  audience: 'editor' | 'author' | 'both';
  audienceLabel: string;
  title: string;
  body: string;
}

export interface HowStep {
  n: string;
  title: string;
  body: string;
}

export type ArchBox =
  /** `external`: a source outside ThaiJO/TCI (shown with a globe and in the legend). */
  | { kind: 'box' | 'data' | 'dashed'; title: string; desc: string; external?: boolean }
  | { kind: 'chips'; label: string; chips: string[]; more?: string }
  /** Bullets read "Term · description"; the term is set in bold. */
  | { kind: 'primary' | 'gateway'; title: string; bullets: string[] };

export interface ArchLane {
  id: string;
  /** Code-style label, identical in both locales, e.g. "03 · GATEWAY". */
  label: string;
  /** Plain-language lane name in the page language. */
  name: string;
  boxes: ArchBox[];
}

export interface ArchBar {
  /** `pipeline` steps run in order; `cross` items apply to every lane. */
  kind: 'pipeline' | 'cross';
  label: string;
  name: string;
  items: string[];
}

export interface Content {
  heroTabs: HeroTab[];
  faq: FaqItem[];
  tools: { flagship: Flagship[]; cards: ToolCard[] };
  proposed: ProposedItem[];
  architecture: { lanes: ArchLane[]; bars: ArchBar[] };
  how: HowStep[];
}

const CONTENT = {
  th: {
    heroTabs: heroTabsTh,
    faq: faqTh,
    tools: toolsTh,
    proposed: proposedTh,
    architecture: architectureTh,
    how: howTh,
  },
  en: {
    heroTabs: heroTabsEn,
    faq: faqEn,
    tools: toolsEn,
    proposed: proposedEn,
    architecture: architectureEn,
    how: howEn,
  },
} as unknown as Record<Locale, Content>;

/** Structured copy for a locale. TH lives in the original handoff files; EN mirrors them. */
export function getContent(locale: Locale): Content {
  return CONTENT[locale];
}
