import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import tabs from '@content/hero-tabs.th.json';
import type { HeroTab } from '@/lib/content';
import { splitGraphemes } from '@/lib/graphemes';
import { HeroDemo } from './HeroDemo';

const TABS = tabs as HeroTab[];
const T = {
  tablistLabel: 'เลือกเครื่องมือ',
  inputLabel: 'คำถามหรือคำสั่งสำหรับ {tool}',
  suggestionsLabel: 'ตัวอย่างคำถาม',
  attachLabel: 'แนบไฟล์',
  pdf: 'PDF',
  source: 'TCI MCP Gateway',
  sourceLabel: 'แหล่งข้อมูล: TCI MCP Gateway',
  send: 'ส่งคำถามไปยัง Workspace',
  sendSoon: 'Workspace จะเปิดให้ทดลองใช้เร็ว ๆ นี้',
};

const setReducedMotion = (reduce: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

const renderDemo = (props: Partial<Parameters<typeof HeroDemo>[0]> = {}) =>
  render(<HeroDemo tabs={TABS} defaultTool="workspace" t={T} {...props} />);

const textarea = () => screen.getByRole('textbox') as HTMLTextAreaElement;

describe('HeroDemo tabs', () => {
  beforeEach(() => setReducedMotion(true));
  afterEach(() => vi.useRealTimers());

  it('renders all eight tools as tabs with the default selected', () => {
    renderDemo({ defaultTool: 'deep' });
    const list = screen.getByRole('tablist', { name: T.tablistLabel });
    const all = within(list).getAllByRole('tab');
    expect(all).toHaveLength(8);
    expect(screen.getByRole('tab', { name: 'Deep Research' })).toHaveAttribute('aria-selected', 'true');
    expect(all.filter((t) => t.getAttribute('aria-selected') === 'true')).toHaveLength(1);
  });

  it('falls back to the first tab when defaultTool is unknown', () => {
    // @ts-expect-error invalid id on purpose
    renderDemo({ defaultTool: 'nope' });
    expect(screen.getByRole('tab', { name: 'Agentic Workspace' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses a roving tabindex and links the tab to the panel', () => {
    renderDemo();
    const active = screen.getByRole('tab', { selected: true });
    expect(active).toHaveAttribute('tabindex', '0');
    for (const tab of screen.getAllByRole('tab', { selected: false })) expect(tab).toHaveAttribute('tabindex', '-1');
    const panel = screen.getByRole('tabpanel');
    expect(active).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', active.id);
  });

  it('swaps placeholder and chips when a tab is clicked', async () => {
    renderDemo();
    await userEvent.click(screen.getByRole('tab', { name: 'AI Chatbot' }));
    expect(screen.getByRole('tab', { name: 'AI Chatbot' })).toHaveAttribute('aria-selected', 'true');
    const chatbot = TABS.find((t) => t.id === 'chatbot')!;
    expect(textarea()).toHaveAttribute('placeholder', chatbot.placeholder);
    const chips = within(screen.getByRole('group', { name: T.suggestionsLabel })).getAllByRole('button');
    expect(chips.map((c) => c.textContent)).toEqual(chatbot.chips);
  });

  it('moves selection and focus with arrow keys, wrapping at the ends', async () => {
    renderDemo();
    const first = screen.getByRole('tab', { name: 'Agentic Workspace' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Research Assistant' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Research Assistant' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'AI Chatbot' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(first).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'AI Chatbot' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('HeroDemo input', () => {
  beforeEach(() => setReducedMotion(true));

  it('labels the textarea with the active tool', () => {
    renderDemo();
    expect(screen.getByRole('textbox', { name: 'คำถามหรือคำสั่งสำหรับ Agentic Workspace' })).toBeInTheDocument();
  });

  it('fills and focuses the textarea when a suggestion chip is clicked', async () => {
    renderDemo();
    const chip = screen.getByRole('button', { name: 'ตรวจรายการอ้างอิงใน PDF' });
    await userEvent.click(chip);
    expect(textarea()).toHaveValue('ตรวจรายการอ้างอิงใน PDF');
    expect(textarea()).toHaveFocus();
  });

  it('submits a GET form with tool and q to the Workspace when configured', () => {
    renderDemo({ workspaceUrl: 'https://ws.example.org/app' });
    const form = screen.getByRole('tabpanel') as HTMLFormElement;
    expect(form.tagName).toBe('FORM');
    expect(form).toHaveAttribute('action', 'https://ws.example.org/app');
    expect(form).toHaveAttribute('method', 'get');
    expect(form.querySelector('input[name="tool"]')).toHaveValue('workspace');
    expect(textarea()).toHaveAttribute('name', 'q');
    expect(screen.getByRole('button', { name: T.send })).not.toHaveAttribute('aria-disabled');
  });

  it('keeps submit inert while no Workspace URL exists', () => {
    renderDemo({ workspaceUrl: undefined });
    const send = screen.getByRole('button', { name: T.send });
    expect(send).toHaveAttribute('aria-disabled', 'true');
    expect(send).toHaveAccessibleDescription(T.sendSoon);
    const event = new Event('submit', { bubbles: true, cancelable: true });
    fireEvent(screen.getByRole('tabpanel'), event);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('HeroDemo typewriter', () => {
  afterEach(() => vi.useRealTimers());

  it('types the new placeholder grapheme by grapheme, without splitting Thai marks', () => {
    setReducedMotion(false);
    vi.useFakeTimers();
    renderDemo();
    const target = TABS.find((t) => t.id === 'deep')!.placeholder;
    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: 'Deep Research' }));
    });
    const seen: string[] = [];
    for (let i = 0; i < 60; i++) {
      act(() => {
        vi.advanceTimersByTime(25);
      });
      seen.push(textarea().getAttribute('placeholder') ?? '');
    }
    expect(seen.at(-1)).toBe(target);
    const graphemes = splitGraphemes(target);
    const boundaries = new Set(graphemes.map((_, i) => graphemes.slice(0, i + 1).join('')));
    boundaries.add('');
    for (const partial of seen) expect(boundaries.has(partial)).toBe(true);
    expect(seen.some((s) => s.length > 0 && s !== target)).toBe(true);
  });

  it('shows the full placeholder immediately under reduced motion', () => {
    setReducedMotion(true);
    renderDemo();
    fireEvent.click(screen.getByRole('tab', { name: 'Deep Research' }));
    expect(textarea()).toHaveAttribute('placeholder', TABS.find((t) => t.id === 'deep')!.placeholder);
  });
});
