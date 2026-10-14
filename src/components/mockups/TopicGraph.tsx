import type { CSSProperties } from 'react';
import { buildTopicGraph, type GraphEdge, type GraphLabel, type GraphNode } from '@/lib/topic-graph';

/**
 * Server-rendered Research Atlas SVG. Each element carries a `data-anim` step timed by
 * cluster: hubs pop, spokes draw outward, satellites pop in turn, labels fade last.
 */
const graph = buildTopicGraph();

export const CLUSTER_START = 150;
export const CLUSTER_GAP = 220;
const clusterAt = (c: number) => CLUSTER_START + c * CLUSTER_GAP;
export const SELECT_AT = CLUSTER_START + graph.clusters.length * CLUSTER_GAP + 150;

type Vars = CSSProperties & Record<`--${string}`, string>;
const t = (d: number, dur: number, extra: Vars = {}): Vars => ({ '--d': `${d}ms`, '--dur': `${dur}ms`, ...extra });
const len = (e: GraphEdge) => Math.hypot(e.x2 - e.x1, e.y2 - e.y1).toFixed(1);

function edgeAnim(e: GraphEdge): { anim: string; style: Vars } {
  switch (e.kind) {
    case 'hub':
      return { anim: 'fade', style: t(0, 400) };
    case 'spoke':
      return { anim: 'draw', style: t(clusterAt(e.cluster!), 520, { '--len': len(e) }) };
    case 'link':
      return { anim: 'draw', style: t(clusterAt(e.cluster!) + 200, 420, { '--len': len(e) }) };
    case 'sel':
      return { anim: 'draw', style: t(SELECT_AT - 150, 480, { '--len': len(e) }) };
  }
}

function nodeAnim(n: GraphNode): Vars {
  if (n.kind === 'sat') return t(clusterAt(n.cluster!) + 120 + (n.index ?? 0) * 15, 380);
  if (n.kind === 'hub') return t(clusterAt(n.cluster!), 420);
  return t(SELECT_AT, 420);
}

function labelAnim(l: GraphLabel): Vars {
  if (l.kind === 'sel') return t(SELECT_AT + 200, 400);
  return t(clusterAt(l.cluster!) + 300, 400);
}

export function TopicGraph() {
  return (
    <svg
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block size-full"
      aria-hidden="true"
    >
      {graph.edges.map((e) => {
        const { anim, style } = edgeAnim(e);
        return (
          <line
            key={e.key}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={e.stroke}
            strokeWidth={e.strokeWidth}
            opacity={e.opacity}
            data-anim={anim}
            style={style}
          />
        );
      })}
      {graph.nodes.map((n) => {
        if (n.kind === 'sel-ring') {
          // pop on the group, one slow turn on the dashed ring itself
          return (
            <g key={n.key} data-anim="pop" style={t(SELECT_AT + 80, 420)}>
              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.r}
                fill="none"
                stroke="#4a44d6"
                strokeWidth={1.5}
                strokeDasharray="3 2"
                data-anim="spin"
                style={t(SELECT_AT + 80, 1600)}
              />
            </g>
          );
        }
        return <circle key={n.key} cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} opacity={n.opacity} data-anim="pop" style={nodeAnim(n)} />;
      })}
      {graph.labels.map((l) => {
        const style = labelAnim(l);
        if (l.kind === 'sat') {
          return (
            <text key={l.key} x={l.x} y={l.y} fontSize={9} fill="#6b6b75" className="font-mono" data-anim="fade" style={style}>
              {l.text}
            </text>
          );
        }
        const sel = l.kind === 'sel';
        return (
          <text
            key={l.key}
            x={l.x}
            y={l.y}
            fontSize={sel ? 13 : 14}
            fontWeight={600}
            textAnchor={sel ? undefined : 'middle'}
            fill={sel ? '#4a44d6' : '#17171c'}
            stroke="#fff"
            strokeWidth={3}
            paintOrder="stroke"
            className="font-sans"
            data-anim="fade"
            style={style}
          >
            {l.text}
          </text>
        );
      })}
    </svg>
  );
}
