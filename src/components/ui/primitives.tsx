import type { CSSProperties, ElementType, ReactNode } from 'react';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Mono, uppercase section label in primary (README › Typography › Eyebrow). */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

/** Flagship badge, e.g. "01 · FLAGSHIP". */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="mono self-start rounded-[6px] bg-primary-tint px-2 py-1 text-[11px] tracking-[0.06em] text-primary">
      {children}
    </span>
  );
}

/**
 * Scroll-reveal wrapper. The inline observer in the layout adds `data-in` before
 * hydration, hence suppressHydrationWarning on this element only.
 */
export function Reveal({
  as: Tag = 'div',
  i,
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  i?: number;
  className?: string;
  style?: Vars;
  children?: ReactNode;
} & Record<string, unknown>) {
  const vars: Vars = { ...style };
  if (i !== undefined) vars['--i'] = i;
  return (
    <Tag data-reveal="" suppressHydrationWarning className={className} style={vars} {...rest}>
      {children}
    </Tag>
  );
}

/** 6px primary dot bullets (README › Tools › Text column). */
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 flex list-none flex-col gap-2 p-0 text-[14px] text-strong">
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-[10px]">
          <span aria-hidden="true" className="size-[6px] flex-none rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Grey bar standing in for a line of text inside a mockup. */
export function Bar({
  w,
  h = 7,
  tone = 'skel',
  anim,
  d,
  dur,
}: {
  w: string;
  h?: number;
  tone?: 'skel' | 'skel-2' | 'dark' | 'primary';
  anim?: string;
  d?: number;
  dur?: number;
}) {
  const bg = { skel: 'bg-skel', 'skel-2': 'bg-skel-2', dark: 'bg-dark-bar', primary: 'bg-primary' }[tone];
  return (
    <span
      aria-hidden="true"
      data-anim={anim}
      className={`block flex-none rounded-[4px] ${bg}`}
      style={{ height: h, width: w, ...timing(d, dur) }}
    />
  );
}

/** Inline timing variables for a `data-anim` step. */
export function timing(d?: number, dur?: number): Vars {
  const v: Vars = {};
  if (d !== undefined) v['--d'] = `${d}ms`;
  if (dur !== undefined) v['--dur'] = `${dur}ms`;
  return v;
}
