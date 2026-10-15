import type { SVGProps } from 'react';

/*
 * TCI AI product mark: a robot drawn on the logo's 3×3 cell grid. Rows, top to bottom:
 * lavender · orange head · lavender, three ring cells, three solid cells; an antenna on
 * top and an ear on each side of the middle row. 96-unit box: 20-unit cells, 4-unit gaps.
 * The favicon (app/icon.svg) is a simplified 32-unit cut of the same shape.
 */
const COLS = [14, 38, 62] as const;
const ROWS = [24, 48, 72] as const;
const CELL = 20;
const R = 5;

/** Rounded square as a path, so ring cells cut a real hole (evenodd) on any background. */
function square(x: number, y: number, size: number, r: number) {
  const s = size - 2 * r;
  return `M${x + r} ${y}h${s}a${r} ${r} 0 0 1 ${r} ${r}v${s}a${r} ${r} 0 0 1 -${r} ${r}h-${s}a${r} ${r} 0 0 1 -${r} -${r}v-${s}a${r} ${r} 0 0 1 ${r} -${r}z`;
}

const RINGS = COLS.map((x) => square(x, ROWS[1], CELL, R) + square(x + 4.25, ROWS[1] + 4.25, 11.5, 2.5)).join('');

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false" {...props}>
      <circle cx="48" cy="8.5" r="3.75" className="fill-brand-orange" />
      <rect x="46.75" y="12" width="2.5" height="8" rx="1" className="fill-primary" />

      <rect x={COLS[0]} y={ROWS[0]} width={CELL} height={CELL} rx={R} className="fill-primary-line" />
      <circle cx="48" cy={ROWS[0] + CELL / 2} r={CELL / 2} className="fill-brand-orange" />
      <rect x={COLS[2]} y={ROWS[0]} width={CELL} height={CELL} rx={R} className="fill-primary-line" />

      <g className="fill-primary">
        <path d={RINGS} fillRule="evenodd" />
        {COLS.map((x) => (
          <rect key={x} x={x} y={ROWS[2]} width={CELL} height={CELL} rx={R} />
        ))}
        {/* Ears: a bar beside the grid with a rounded bump, centred on the ring row. */}
        <rect x="6" y="42" width="4" height="32" rx="2" />
        <rect x="1.5" y="49" width="6" height="18" rx="3" />
        <rect x="86" y="42" width="4" height="32" rx="2" />
        <rect x="88.5" y="49" width="6" height="18" rx="3" />
      </g>
    </svg>
  );
}

/** "TCI AI" with the last word in the brand indigo, as in the logo lockup. */
export function BrandName({ name }: { name: string }) {
  const cut = name.lastIndexOf(' ');
  if (cut < 0) return name;
  return (
    <>
      {name.slice(0, cut + 1)}
      <span className="text-primary">{name.slice(cut + 1)}</span>
    </>
  );
}
