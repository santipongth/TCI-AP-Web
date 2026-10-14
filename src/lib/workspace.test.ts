import { describe, expect, it } from 'vitest';
import { buildWorkspaceHref } from './workspace';

describe('buildWorkspaceHref', () => {
  it('returns null when no Workspace URL is configured', () => {
    expect(buildWorkspaceHref(undefined, 'workspace', 'hello')).toBeNull();
    expect(buildWorkspaceHref('', 'workspace', 'hello')).toBeNull();
    expect(buildWorkspaceHref('   ', 'workspace', 'hello')).toBeNull();
  });

  it('adds tool and q parameters, encoding Thai text', () => {
    const href = buildWorkspaceHref('https://workspace.example.org/app', 'deep', 'ผลของ PM2.5 ต่อสุขภาพ');
    const url = new URL(href!);
    expect(url.origin + url.pathname).toBe('https://workspace.example.org/app');
    expect(url.searchParams.get('tool')).toBe('deep');
    expect(url.searchParams.get('q')).toBe('ผลของ PM2.5 ต่อสุขภาพ');
  });

  it('keeps existing query parameters on the base URL', () => {
    const url = new URL(buildWorkspaceHref('https://ws.example.org/?ref=landing', 'refs', 'x')!);
    expect(url.searchParams.get('ref')).toBe('landing');
    expect(url.searchParams.get('tool')).toBe('refs');
  });

  it('omits q when the question is blank', () => {
    const url = new URL(buildWorkspaceHref('https://ws.example.org/', 'chatbot', '   ')!);
    expect(url.searchParams.get('tool')).toBe('chatbot');
    expect(url.searchParams.has('q')).toBe(false);
  });

  it('trims the question', () => {
    const url = new URL(buildWorkspaceHref('https://ws.example.org/', 'assistant', '  ถาม  ')!);
    expect(url.searchParams.get('q')).toBe('ถาม');
  });
});
