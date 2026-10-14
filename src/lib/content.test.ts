import { describe, expect, it } from 'vitest';
import en from '@messages/en.json';
import th from '@messages/th.json';
import { getContent } from './content';

/** Every key path plus array lengths, e.g. "tools.flagship[3].bullets#3". */
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return [`${path}#${value.length}`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  return [path];
}

const tokens = (s: string) => (s.match(/\{\w+\}|<\/?\w+>/g) ?? []).sort();

function strings(value: unknown, path = ''): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe('TH/EN parity', () => {
  const thContent = getContent('th');
  const enContent = getContent('en');

  it('messages have the same keys', () => {
    expect(shape(en)).toEqual(shape(th));
  });

  it('structured content has the same shape', () => {
    expect(shape(enContent)).toEqual(shape(thContent));
  });

  it('keeps ids, kinds and codes identical', () => {
    const codes = (c: typeof thContent) => ({
      tabs: c.heroTabs.map((t) => t.id),
      flagship: c.tools.flagship.map((f) => [f.id, f.badge]),
      cards: c.tools.cards.map((x) => x.mono),
      proposed: c.proposed.map((p) => p.audience),
      lanes: c.architecture.lanes.map((l) => [l.id, l.label, l.boxes.map((b) => b.kind)]),
      bars: c.architecture.bars.map((b) => [b.kind, b.label]),
      how: c.how.map((s) => s.n),
    });
    expect(codes(enContent)).toEqual(codes(thContent));
  });

  it('keeps every {placeholder} and <tag> in each string', () => {
    const enMap = new Map([...strings(en), ...strings(enContent, 'content')]);
    for (const [path, text] of [...strings(th), ...strings(thContent, 'content')]) {
      expect(tokens(enMap.get(path) ?? ''), path).toEqual(tokens(text));
    }
  });
});
