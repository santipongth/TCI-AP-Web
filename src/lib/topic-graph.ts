/**
 * Research Atlas topic map as plain data, ported from `topicGraph()` in the design prototype.
 * It is a seeded illustration (README open item #4); swap for real topic-model output later.
 * Element order matches the prototype so the SVG paints identically.
 */

export interface Cluster {
  name: string;
  color: string;
  x: number;
  y: number;
  r: number;
  n: number;
}

export interface GraphEdge {
  key: string;
  kind: 'hub' | 'spoke' | 'link' | 'sel';
  cluster?: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

export interface GraphNode {
  key: string;
  kind: 'sat' | 'hub' | 'sel-ring' | 'sel';
  cluster?: number;
  /** Position within its cluster, for stagger. */
  index?: number;
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  opacity?: number;
}

export interface GraphLabel {
  key: string;
  kind: 'sat' | 'hub' | 'sel';
  cluster?: number;
  x: number;
  y: number;
  text: string;
}

export interface TopicGraph {
  width: number;
  height: number;
  clusters: Cluster[];
  edges: GraphEdge[];
  nodes: GraphNode[];
  labels: GraphLabel[];
  selected: { x: number; y: number; r: number; color: string };
}

export const CLUSTERS: Cluster[] = [
  { name: 'สาธารณสุข', color: '#8f5ef0', x: 150, y: 110, r: 27, n: 13 },
  { name: 'เกษตรและอาหาร', color: '#e0554f', x: 125, y: 248, r: 22, n: 11 },
  { name: 'วิศวกรรม', color: '#3a74d6', x: 395, y: 88, r: 20, n: 10 },
  { name: 'ศึกษาศาสตร์', color: '#37a862', x: 300, y: 212, r: 18, n: 10 },
  { name: 'สังคมศาสตร์', color: '#b89a1f', x: 428, y: 262, r: 16, n: 9 },
];

const SEED = 20261014;
const WIDTH = 520;
const HEIGHT = 340;

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildTopicGraph(clusters: Cluster[] = CLUSTERS): TopicGraph {
  const rnd = mulberry32(SEED);
  const edges: GraphEdge[] = [];
  const nodes: GraphNode[] = [];
  const labels: GraphLabel[] = [];

  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const a = clusters[i]!;
      const b = clusters[j]!;
      edges.push({ key: `h${i}${j}`, kind: 'hub', x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#9a9aa4', strokeWidth: 1.2 + rnd() * 2.2, opacity: 0.12 });
    }
  }

  clusters.forEach((cl, ci) => {
    const sats: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < cl.n; i++) {
      const angle = rnd() * Math.PI * 2;
      const dist = 38 + rnd() * 64;
      const x = Math.max(10, Math.min(WIDTH - 10, cl.x + Math.cos(angle) * dist));
      const y = Math.max(10, Math.min(HEIGHT - 10, cl.y + Math.sin(angle) * dist));
      const r = 2.5 + rnd() * 6;
      sats.push({ x, y, r });
      edges.push({ key: `e${ci}-${i}`, kind: 'spoke', cluster: ci, x1: cl.x, y1: cl.y, x2: x, y2: y, stroke: cl.color, strokeWidth: 0.8, opacity: 0.35 });
      // Short-circuit matters: rnd() is only drawn for i > 0, exactly as in the prototype.
      if (i > 0 && rnd() < 0.55) {
        const p = sats[Math.floor(rnd() * i)]!;
        edges.push({ key: `s${ci}-${i}`, kind: 'link', cluster: ci, x1: p.x, y1: p.y, x2: x, y2: y, stroke: cl.color, strokeWidth: 0.6, opacity: 0.22 });
      }
    }
    sats.forEach((p, i) => {
      nodes.push({ key: `n${ci}-${i}`, kind: 'sat', cluster: ci, index: i, cx: p.x, cy: p.y, r: p.r, fill: cl.color, opacity: 0.85 });
      if (i % 3 === 0) labels.push({ key: `t${ci}-${i}`, kind: 'sat', cluster: ci, x: p.x + p.r + 2, y: p.y + 3, text: `T${ci * 10 + i + 1}` });
    });
    nodes.push({ key: `hub${ci}`, kind: 'hub', cluster: ci, cx: cl.x, cy: cl.y, r: cl.r, fill: cl.color, opacity: 0.92 });
    labels.push({ key: `hl${ci}`, kind: 'hub', cluster: ci, x: cl.x, y: cl.y + cl.r + 15, text: cl.name });
  });

  const selected = { x: 222, y: 150, r: 11, color: '#8f5ef0' };
  const c0 = clusters[0]!;
  const c2 = clusters[2]!;
  edges.push({ key: 'sel-e', kind: 'sel', x1: c0.x, y1: c0.y, x2: selected.x, y2: selected.y, stroke: selected.color, strokeWidth: 1.6, opacity: 0.7 });
  edges.push({ key: 'sel-e2', kind: 'sel', x1: c2.x, y1: c2.y, x2: selected.x, y2: selected.y, stroke: '#3a74d6', strokeWidth: 1, opacity: 0.4 });
  nodes.push({ key: 'sel-ring', kind: 'sel-ring', cx: selected.x, cy: selected.y, r: selected.r + 5 });
  nodes.push({ key: 'sel', kind: 'sel', cx: selected.x, cy: selected.y, r: selected.r, fill: selected.color });
  labels.push({ key: 'sel-l', kind: 'sel', x: selected.x + selected.r + 9, y: selected.y + 4.5, text: 'T5 · PM2.5 และสุขภาพ' });

  return { width: WIDTH, height: HEIGHT, clusters, edges, nodes, labels, selected };
}
