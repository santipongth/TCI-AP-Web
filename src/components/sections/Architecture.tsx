import { Scene } from '@/components/motion/Scene';
import { ArrowLeftRight } from 'lucide-react';
import { SectionHeader, timing } from '@/components/ui/primitives';
import type { ArchBar, ArchBox, ArchLane } from '@/lib/content';

interface Props {
  t: { eyebrow: string; title: string; lead: string; diagramLabel: string };
  lanes: ArchLane[];
  bars: ArchBar[];
}

const laneHeader = 'mono border-b border-line px-[2px] pb-2 text-[10.5px] tracking-[0.08em] text-muted';
const chipTint = 'rounded-full bg-primary-tint px-[7px] py-[2px] text-[11px] text-primary';

function Bullet({ children, dot }: { children: string; dot: string }) {
  return (
    <span className="flex items-center gap-2 text-[12px]">
      <span className={`size-[5px] flex-none rounded-full ${dot}`} />
      {children}
    </span>
  );
}

function Box({ box }: { box: ArchBox }) {
  switch (box.kind) {
    case 'primary':
      return (
        <div className="flex flex-col gap-[7px] rounded-[14px] bg-linear-to-br from-primary to-[#5b55e6] p-[14px] text-white shadow-[0_14px_30px_-16px_rgba(74,68,214,0.8)]">
          <span className="text-[14px] font-semibold">{box.title}</span>
          <div className="flex flex-col gap-[7px] text-primary-line">
            {box.bullets.map((b) => (
              <Bullet key={b} dot="bg-primary-dot-dark">
                {b}
              </Bullet>
            ))}
          </div>
        </div>
      );
    case 'dark':
      return (
        <div className="flex flex-col gap-[7px] rounded-[14px] bg-ink p-[14px] text-white shadow-[0_14px_30px_-18px_rgba(23,23,28,0.7)]">
          <span className="text-[14px] font-semibold">{box.title}</span>
          <div className="flex flex-col gap-[7px] text-on-dark-muted">
            {box.bullets.map((b) => (
              <Bullet key={b} dot="bg-primary-dot-dark">
                {b}
              </Bullet>
            ))}
          </div>
        </div>
      );
    case 'chips':
      return (
        <div className="flex flex-col gap-2 rounded-[14px] border border-line bg-white px-[14px] py-3">
          <span className="mono text-[10px] tracking-[0.06em] text-primary">{box.label}</span>
          <div className="flex flex-wrap gap-1">
            {box.chips.map((c) => (
              <span key={c} className={chipTint}>
                {c}
              </span>
            ))}
            {box.more && (
              <span className="rounded-full border border-dashed border-primary-line-hover px-[7px] py-px text-[11px] text-muted">{box.more}</span>
            )}
          </div>
        </div>
      );
    default: {
      const surface = {
        box: 'border border-line bg-white shadow-[0_1px_2px_rgba(23,23,28,0.04)]',
        data: 'border border-line bg-data',
        dashed: 'border border-dashed border-dash-2',
      }[box.kind];
      return (
        <div className={`flex flex-col gap-[3px] rounded-[14px] px-[14px] py-3 ${surface}`}>
          <span className={`text-[13.5px] font-semibold ${box.kind === 'dashed' ? 'text-strong' : ''}`}>{box.title}</span>
          <span className="text-[11.5px] text-muted">{box.desc}</span>
        </div>
      );
    }
  }
}

/** Connector between lanes: ⇄ side by side (≥1200px), ⇅ when lanes stack. A packet crosses it twice on play. */
function Gutter({ index }: { index: number }) {
  return (
    <div className="flex items-center justify-center py-1 text-arrow min-[1200px]:py-0 min-[1200px]:pt-6">
      <span className="relative grid place-items-center rotate-90 min-[1200px]:rotate-0">
        <ArrowLeftRight aria-hidden="true" className="size-4" />
        <span
          aria-hidden="true"
          data-anim="flow"
          style={timing(900 + index * 160, 1100)}
          className="absolute top-1/2 left-1/2 -mt-[2px] -ml-[2px] size-1 rounded-full bg-primary shadow-[0_0_6px_#4a44d6]"
        />
      </span>
    </div>
  );
}

function Bar({ bar, at }: { bar: ArchBar; at: number }) {
  const surface = bar.kind === 'data' ? 'border border-line bg-data' : 'border border-dashed border-dash-2 bg-white/60';
  return (
    <div
      data-anim="fade-up"
      style={timing(at, 500)}
      className={`flex flex-wrap items-center gap-x-[18px] gap-y-2 rounded-[14px] px-4 py-3 text-[12.5px] text-strong ${surface}`}
    >
      <span className="mono basis-full text-[10.5px] tracking-[0.08em] text-muted sm:basis-auto">{bar.label}</span>
      {bar.items.map((item, i) => (
        <span key={item} className="contents">
          <span>{item}</span>
          {i < bar.items.length - 1 && (
            <span aria-hidden="true" className="text-on-dark-muted">
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * Architecture: five lanes side by side from 1200px (where 1000px of diagram fits);
 * below that the lanes stack with ⇅ connectors, so nothing scrolls sideways.
 */
export function Architecture({ t, lanes, bars }: Props) {
  return (
    <section id="architecture" className="section-x py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} className="mb-12" />

        <Scene
          role="group"
          aria-label={t.diagramLabel}
          threshold={0.15}
          className="rounded-[28px] border border-line bg-[linear-gradient(180deg,#fafafb,#fff_45%)] p-3 shadow-card sm:p-6 lg:p-8"
        >
          <div className="flex flex-col gap-[14px]">
            <div className="flex flex-col gap-1 min-[1200px]:grid min-[1200px]:grid-cols-[1fr_26px_1.2fr_26px_1.2fr_26px_1fr_26px_1fr] min-[1200px]:items-stretch min-[1200px]:gap-0">
              {lanes.map((lane, i) => (
                <div key={lane.id} className="contents">
                  <div data-anim="fade-up" style={timing(i * 110, 520)} className="flex flex-col gap-2">
                    <div className={laneHeader}>{lane.label}</div>
                    <div className="grid gap-2 sm:grid-cols-2 min-[1200px]:flex min-[1200px]:flex-1 min-[1200px]:flex-col">
                      {lane.boxes.map((box, j) => (
                        <Box key={j} box={box} />
                      ))}
                    </div>
                  </div>
                  {i < lanes.length - 1 && <Gutter index={i} />}
                </div>
              ))}
            </div>
            {bars.map((bar, i) => (
              <Bar key={bar.label} bar={bar} at={650 + i * 100} />
            ))}
          </div>
        </Scene>
      </div>
    </section>
  );
}
