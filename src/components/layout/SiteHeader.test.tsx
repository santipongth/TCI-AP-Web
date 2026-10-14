import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

const T = {
  brand: 'TCI AI',
  tagline: 'RESEARCH TOOLS',
  homeLabel: 'TCI AI หน้าแรก',
  menuLabel: 'เมนูหลัก',
  menuOpen: 'เปิดเมนู',
  menuClose: 'ปิดเมนู',
  tools: 'เครื่องมือ',
  architecture: 'สถาปัตยกรรม',
  how: 'วิธีทำงาน',
  faq: 'คำถามที่พบบ่อย',
  thaijo: 'ThaiJO',
  cta: 'ทดลองใช้ Workspace',
  switchTo: 'EN',
  switchLabel: 'Switch to English',
};

const renderHeader = () => render(<SiteHeader otherLocale="en" ctaHref="#top" thaijoHref="https://www.tci-thaijo.org/" t={T} />);
const menuButton = () => screen.getByRole('button', { name: /เปิดเมนู|ปิดเมนู/ });

describe('SiteHeader mobile menu', () => {
  it('starts closed, with the button controlling a hidden panel', () => {
    renderHeader();
    const button = menuButton();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAccessibleName('เปิดเมนู');
    const panel = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(panel).not.toBeVisible();
  });

  it('opens to show every section link, the language switch and the CTA', async () => {
    renderHeader();
    await userEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
    expect(menuButton()).toHaveAccessibleName('ปิดเมนู');
    const panel = document.getElementById(menuButton().getAttribute('aria-controls')!)!;
    expect(panel).toBeVisible();
    for (const name of ['เครื่องมือ', 'สถาปัตยกรรม', 'วิธีทำงาน', 'คำถามที่พบบ่อย']) {
      expect(panel.querySelector(`a[href^="#"]`)).toBeTruthy();
      expect(Array.from(panel.querySelectorAll('a')).some((a) => a.textContent === name)).toBe(true);
    }
    expect(Array.from(panel.querySelectorAll('a')).some((a) => a.getAttribute('hreflang') === 'en')).toBe(true);
    expect(Array.from(panel.querySelectorAll('a')).some((a) => a.textContent?.includes('ทดลองใช้ Workspace'))).toBe(true);
  });

  it('closes on Escape and returns focus to the menu button', async () => {
    renderHeader();
    await userEvent.click(menuButton());
    await userEvent.keyboard('{Escape}');
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton()).toHaveFocus();
  });

  it('closes after a section link is chosen', async () => {
    renderHeader();
    await userEvent.click(menuButton());
    const panel = document.getElementById(menuButton().getAttribute('aria-controls')!)!;
    const link = Array.from(panel.querySelectorAll('a')).find((a) => a.textContent === 'วิธีทำงาน')!;
    await userEvent.click(link);
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });
});
