import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockIntersectionObserver } from '../../../vitest.setup';
import { useScene } from './use-scene';

function Probe({ threshold }: { threshold?: number }) {
  const { ref, phase } = useScene<HTMLDivElement>({ threshold });
  return (
    <div ref={ref} data-testid="scene" data-scene={phase}>
      scene
    </div>
  );
}

const lastObserver = () => MockIntersectionObserver.instances.at(-1)!;
const setReducedMotion = (reduce: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

describe('useScene', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    setReducedMotion(false);
  });
  afterEach(() => vi.restoreAllMocks());

  it('renders the final frame before any observation (SSR / no-JS parity)', () => {
    render(<Probe />);
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'final');
  });

  it('arms while offscreen, then plays once enough of it is visible', () => {
    render(<Probe threshold={0.35} />);
    act(() => lastObserver().trigger({ isIntersecting: false, intersectionRatio: 0 }));
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'armed');

    act(() => lastObserver().trigger({ isIntersecting: true, intersectionRatio: 0.1 }));
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'armed');

    act(() => lastObserver().trigger({ isIntersecting: true, intersectionRatio: 0.5 }));
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'play');
  });

  it('stays final when already visible on mount, so nothing visible flashes', () => {
    render(<Probe />);
    act(() => lastObserver().trigger({ isIntersecting: true, intersectionRatio: 0.8 }));
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'final');
  });

  it('re-arms after leaving the viewport so the intro replays on re-entry', () => {
    render(<Probe />);
    act(() => lastObserver().trigger({ isIntersecting: true, intersectionRatio: 0.8 }));
    act(() => lastObserver().trigger({ isIntersecting: false, intersectionRatio: 0 }));
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'armed');
    act(() => lastObserver().trigger({ isIntersecting: true, intersectionRatio: 0.6 }));
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'play');
  });

  it('never leaves the final frame under prefers-reduced-motion', () => {
    setReducedMotion(true);
    render(<Probe />);
    expect(MockIntersectionObserver.instances).toHaveLength(0);
    expect(screen.getByTestId('scene')).toHaveAttribute('data-scene', 'final');
  });

  it('disconnects its observer on unmount', () => {
    const { unmount } = render(<Probe />);
    const io = lastObserver();
    const spy = vi.spyOn(io, 'disconnect');
    unmount();
    expect(spy).toHaveBeenCalled();
  });
});
