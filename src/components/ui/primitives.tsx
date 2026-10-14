import { Check } from 'lucide-react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Mono, uppercase section label in primary (README › Typography › Eyebrow). */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

/** Flagship badge, e.g. "01 · FLAGSHIP". */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="mono w-fit rounded-full bg-primary-tint px-3 py-1 text-[11px] tracking-[0.06em] text-primary ring-1 ring-primary-line">
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

/** Feature bullets with a check in a soft indigo disc. */
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 flex list-none flex-col gap-3 p-0 text-[14.5px] leading-[1.6] text-strong">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-[3px] grid size-5 flex-none place-items-center rounded-full bg-primary-tint text-primary ring-1 ring-primary-line">
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Eyebrow pill + H2 + optional lead, centred or left-aligned. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'center',
  className = '',
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  const centred = align === 'center';
  return (
    <Reveal className={`flex flex-col gap-4 ${centred ? 'mx-auto max-w-[760px] items-center text-center' : 'max-w-[760px]'} ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="m-0 text-h2 [text-wrap:balance]">{title}</h2>
      {lead && <p className="m-0 text-[16px] leading-[1.75] text-muted sm:text-[17px]">{lead}</p>}
    </Reveal>
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
