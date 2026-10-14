import { describe, expect, it } from 'vitest';
import { buildTopicGraph } from './topic-graph';

/**
 * Golden reference: `topicGraph()` from design/TCI AI Landing Page.dc.html,
 * copied verbatim except that it records plain objects instead of React elements.
 * The PRNG call order (including the `i > 0 && rnd() < .55` short-circuit) must match.
 */
function prototypeTopicGraph() {
  let s = 20261014;
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  type Rec = Record<string, unknown>;
  const h = (type: string, props: Rec, text?: string): Rec => ({ type, ...props, ...(text ? { text } : {}) });
  const clusters = [
    { name: 'สาธารณสุข', c: '#8f5ef0', x: 150, y: 110, r: 27, n: 13 },
    { name: 'เกษตรและอาหาร', c: '#e0554f', x: 125, y: 248, r: 22, n: 11 },
    { name: 'วิศวกรรม', c: '#3a74d6', x: 395, y: 88, r: 20, n: 10 },
    { name: 'ศึกษาศาสตร์', c: '#37a862', x: 300, y: 212, r: 18, n: 10 },
    { name: 'สังคมศาสตร์', c: '#b89a1f', x: 428, y: 262, r: 16, n: 9 },
  ];
  const edges: Rec[] = [];
  const nodes: Rec[] = [];
  const labels: Rec[] = [];
  for (let i = 0; i < clusters.length; i++)
    for (let j = i + 1; j < clusters.length; j++) {
      edges.push(h('line', { key: `h${i}${j}`, x1: clusters[i]!.x, y1: clusters[i]!.y, x2: clusters[j]!.x, y2: clusters[j]!.y, stroke: '#9a9aa4', strokeWidth: 1.2 + rnd() * 2.2, opacity: 0.12 }));
    }
  clusters.forEach((cl, ci) => {
    const sats: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < cl.n; i++) {
      const a = rnd() * Math.PI * 2,
        d = 38 + rnd() * 64;
      const x = Math.max(10, Math.min(510, cl.x + Math.cos(a) * d)),
        y = Math.max(10, Math.min(330, cl.y + Math.sin(a) * d));
      const r = 2.5 + rnd() * 6;
      sats.push({ x, y, r });
      edges.push(h('line', { key: `e${ci}-${i}`, x1: cl.x, y1: cl.y, x2: x, y2: y, stroke: cl.c, strokeWidth: 0.8, opacity: 0.35 }));
      if (i > 0 && rnd() < 0.55) {
        const p = sats[Math.floor(rnd() * i)]!;
        edges.push(h('line', { key: `s${ci}-${i}`, x1: p.x, y1: p.y, x2: x, y2: y, stroke: cl.c, strokeWidth: 0.6, opacity: 0.22 }));
      }
    }
    sats.forEach((p, i) => {
      nodes.push(h('circle', { key: `n${ci}-${i}`, cx: p.x, cy: p.y, r: p.r, fill: cl.c, opacity: 0.85 }));
      if (i % 3 === 0) labels.push(h('text', { key: `t${ci}-${i}`, x: p.x + p.r + 2, y: p.y + 3 }, `T${ci * 10 + i + 1}`));
    });
    nodes.push(h('circle', { key: `hub${ci}`, cx: cl.x, cy: cl.y, r: cl.r, fill: cl.c, opacity: 0.92 }));
    labels.push(h('text', { key: `hl${ci}`, x: cl.x, y: cl.y + cl.r + 15 }, cl.name));
  });
  const sel = { x: 222, y: 150, r: 11, c: '#8f5ef0' };
  edges.push(h('line', { key: 'sel-e', x1: clusters[0]!.x, y1: clusters[0]!.y, x2: sel.x, y2: sel.y, stroke: sel.c, strokeWidth: 1.6, opacity: 0.7 }));
  edges.push(h('line', { key: 'sel-e2', x1: clusters[2]!.x, y1: clusters[2]!.y, x2: sel.x, y2: sel.y, stroke: '#3a74d6', strokeWidth: 1, opacity: 0.4 }));
  nodes.push(h('circle', { key: 'sel-ring', cx: sel.x, cy: sel.y, r: sel.r + 5 }));
  nodes.push(h('circle', { key: 'sel', cx: sel.x, cy: sel.y, r: sel.r, fill: sel.c }));
  labels.push(h('text', { key: 'sel-l', x: sel.x + sel.r + 9, y: sel.y + 4.5 }, 'T5 · PM2.5 และสุขภาพ'));
  return { edges, nodes, labels };
}

describe('buildTopicGraph', () => {
  const graph = buildTopicGraph();
  const golden = prototypeTopicGraph();

  it('has the prototype element counts', () => {
    expect(graph.edges.filter((e) => e.kind === 'hub')).toHaveLength(10);
    expect(graph.nodes.filter((n) => n.kind === 'sat')).toHaveLength(53);
    expect(graph.nodes).toHaveLength(60);
    expect(graph.labels).toHaveLength(26);
  });

  it('reproduces every edge of the prototype in order', () => {
    expect(graph.edges.map(({ key, x1, y1, x2, y2, stroke, strokeWidth, opacity }) => ({ type: 'line', key, x1, y1, x2, y2, stroke, strokeWidth, opacity }))).toEqual(golden.edges);
  });

  it('reproduces every node position, size and colour in order', () => {
    expect(graph.nodes.map((n) => [n.key, n.cx, n.cy, n.r])).toEqual(golden.nodes.map((n) => [n.key, n.cx, n.cy, n.r]));
    const fills = golden.nodes.filter((n) => 'fill' in n).map((n) => [n.key, n.fill]);
    expect(graph.nodes.filter((n) => n.fill).map((n) => [n.key, n.fill])).toEqual(fills);
  });

  it('reproduces every label position and text in order', () => {
    expect(graph.labels.map((l) => [l.key, l.x, l.y, l.text])).toEqual(golden.labels.map((l) => [l.key, l.x, l.y, l.text]));
  });

  it('tags every satellite, spoke and label with its cluster for staggered animation', () => {
    for (const n of graph.nodes.filter((n) => n.kind === 'sat' || n.kind === 'hub')) {
      expect(n.cluster).toBeGreaterThanOrEqual(0);
      expect(n.cluster).toBeLessThan(5);
    }
    expect(graph.edges.filter((e) => e.kind === 'spoke').every((e) => typeof e.cluster === 'number')).toBe(true);
  });

  it('is deterministic', () => {
    expect(buildTopicGraph()).toEqual(graph);
  });
});
