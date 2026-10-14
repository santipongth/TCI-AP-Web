import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import faq from '@content/faq.th.json';
import { FaqAccordion } from './FaqAccordion';

const ITEMS = faq as { question: string; answer: string }[];
const q = (i: number) => screen.getByRole('button', { name: ITEMS[i]!.question });

describe('FaqAccordion', () => {
  it('opens the first item on load and keeps the rest closed', () => {
    render(<FaqAccordion items={ITEMS} />);
    expect(q(0)).toHaveAttribute('aria-expanded', 'true');
    for (let i = 1; i < ITEMS.length; i++) expect(q(i)).toHaveAttribute('aria-expanded', 'false');
  });

  it('wires each button to its answer region', () => {
    render(<FaqAccordion items={ITEMS} />);
    const panelId = q(0).getAttribute('aria-controls')!;
    const panel = document.getElementById(panelId)!;
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-labelledby', q(0).id);
    expect(panel).toHaveTextContent(ITEMS[0]!.answer);
  });

  it('allows only one open item at a time', async () => {
    render(<FaqAccordion items={ITEMS} />);
    await userEvent.click(q(2));
    expect(q(2)).toHaveAttribute('aria-expanded', 'true');
    expect(q(0)).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the open item when it is clicked again', async () => {
    render(<FaqAccordion items={ITEMS} />);
    await userEvent.click(q(0));
    expect(screen.getAllByRole('button').every((b) => b.getAttribute('aria-expanded') === 'false')).toBe(true);
  });

  it('makes closed answers inert so their content is not focusable or read', async () => {
    render(<FaqAccordion items={ITEMS} />);
    const closed = document.getElementById(q(1).getAttribute('aria-controls')!)!;
    expect(closed).toHaveAttribute('inert');
    const open = document.getElementById(q(0).getAttribute('aria-controls')!)!;
    expect(open).not.toHaveAttribute('inert');
  });
});
