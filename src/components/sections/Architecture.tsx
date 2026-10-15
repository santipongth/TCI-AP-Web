import { Scene } from '@/components/motion/Scene';
import { ArrowLeftRight, ArrowRight, Globe } from 'lucide-react';
import { SectionHeader, timing } from '@/components/ui/primitives';
import type { ArchBar, ArchBox, ArchLane } from '@/lib/content';

interface Legend {
  label: string;
  core: string;
  data: string;
  external: string;
  extensible: string;
}

interface Props {
  t: { eyebrow: string; title: string; lead: string; diagramLabel: string; legend: Legend };
  lanes: ArchLane[];
  bars: ArchBar[];
}

const chipTint = 'rounded-full bg-primary-tint px-[7px] py-[2px] text-[11px] text-primary';
const swatch = 'size-3.5 flex-none rounded-[4px] border border-dash-2';

function LaneHeader({ lane }: { lane: ArchLane }) {
  return (
    <div className="border-b border-line px-[2px] pb-2">
      <span className="mono block text-[10.5px] tracking-[0.08em] text-muted">{lane.label}</span>
      <h3 className="mt-[2px] text-[14px] leading-snug font-semibold text-ink">{lane.name}</h3>
    </div>
  );
}

/** "Term · description" bullets: the term in bold so the box scans as a list of capabilities. */
function Bullets({ items, dot, term }: { items: string[]; dot: string; term: string }) {
  return (
    <ul className="flex flex-col gap-[6px] text-[12px] leading-[1.55]">
      {items.map((item) => {
        const [head, ...rest] = item.split(' · ');
        return (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className={`mt-[7px] size-[5px] flex-none rounded-full ${dot}`} />
            <span>
              <span className={`font-semibold ${term}`}>{head}</span>
              {rest.length > 0 && ` · ${rest.join(' · ')}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Box({ box, externalLabel }: { box: ArchBox; externalLabel: string }) {
  switch (box.kind) {
    case 'primary':
      return (
        <div className="flex flex-col gap-2 rounded-[14px] bg-linear-to-br from-primary to-[#5b55e6] p-[14px] text-primary-line shadow-[0_14px_30px_-16px_rgba(74,68,214,0.8)]">
          <span className="text-[14px] font-semibold text-white">{box.title}</span>
          <Bullets items={box.bullets} dot="bg-primary-dot-dark" term="text-white" />
        </div>
      );
    case 'gateway':
      return (
        <div className="flex flex-col gap-2 rounded-[14px] border border-gateway-line bg-linear-to-b from-gateway-top to-gateway p-[14px] text-body shadow-[0_14px_30px_-20px_rgba(14,91,112,0.35)]">
          <span className="text-[14px] font-semibold text-gateway-ink">{box.title}</span>
          <Bullets items={box.bullets} dot="bg-gateway-dot" term="text-ink" />
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
          <span className={`flex items-start justify-between gap-2 text-[13.5px] font-semibold ${box.kind === 'dashed' ? 'text-strong' : ''}`}>
            {box.title}
            {box.external && (
              <>
                <Globe aria-hidden="true" className="mt-[3px] size-3.5 flex-none text-muted" />
                <span className="sr-only">({externalLabel})</span>
              </>
            )}
          </span>
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

/** Pipeline steps run in order (→, ordered list); cross-cutting items apply to every lane (·). */
function Bar({ bar, at }: { bar: ArchBar; at: number }) {
  const pipeline = bar.kind === 'pipeline';
  const List = pipeline ? 'ol' : 'ul';
  return (
    <div
      data-anim="fade-up"
      style={timing(at, 500)}
      className={`flex flex-col gap-2 rounded-[14px] border px-4 py-3 sm:flex-row sm:items-center sm:gap-5 ${
        pipeline ? 'border-line bg-data' : 'border-primary-line bg-primary-tint/50'
      }`}
    >
      <div className="flex-none sm:w-[160px]">
        <span className="mono block text-[10.5px] tracking-[0.08em] text-muted">{bar.label}</span>
        <span className="block text-[13px] font-semibold text-ink">{bar.name}</span>
      </div>
      <List className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] text-strong">
        {bar.items.map((item, i) => (
          <li key={item} className="flex items-center gap-2">
            {i > 0 &&
              (pipeline ? (
                <ArrowRight aria-hidden="true" className="size-3.5 flex-none text-arrow" />
              ) : (
                <span aria-hidden="true" className="text-arrow">
                  ·
                </span>
              ))}
            <span>{item}</span>
          </li>
        ))}
      </List>
    </div>
  );
}

function LegendRow({ t, at }: { t: Legend; at: number }) {
  return (
    <ul
      aria-label={t.label}
      data-anim="fade-up"
      style={timing(at, 500)}
      className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 pt-1 text-[12px] text-muted"
    >
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className={`${swatch} bg-white`} />
        {t.core}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className={`${swatch} bg-data`} />
        {t.data}
      </li>
      <li className="flex items-center gap-2">
        <Globe aria-hidden="true" className="size-3.5 flex-none" />
        {t.external}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className={`${swatch} border-dashed`} />
        {t.extensible}
      </li>
    </ul>
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
                    <LaneHeader lane={lane} />
                    <div className="grid gap-2 sm:grid-cols-2 min-[1200px]:flex min-[1200px]:flex-1 min-[1200px]:flex-col">
                      {lane.boxes.map((box, j) => (
                        <Box key={j} box={box} externalLabel={t.legend.external} />
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
            <LegendRow t={t.legend} at={650 + bars.length * 100} />
          </div>
        </Scene>
      </div>
    </section>
  );
}
