import { Scene } from '@/components/motion/Scene';
import { Eyebrow, Reveal, timing } from '@/components/ui/primitives';
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
        <div className="flex flex-col gap-[7px] rounded-[12px] bg-primary p-[14px] text-white">
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
        <div className="flex flex-1 flex-col gap-[7px] rounded-[12px] bg-ink p-[14px] text-white">
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
        <div className="flex flex-col gap-2 rounded-[12px] border border-line bg-white px-[14px] py-3">
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
        box: 'border border-line bg-white',
        data: 'border border-line bg-data',
        dashed: 'border border-dashed border-dash-2',
      }[box.kind];
      return (
        <div className={`flex flex-col gap-[3px] rounded-[12px] px-[14px] py-3 ${surface}`}>
          <span className={`text-[13.5px] font-semibold ${box.kind === 'dashed' ? 'text-strong' : ''}`}>{box.title}</span>
          <span className="text-[11.5px] text-muted">{box.desc}</span>
        </div>
      );
    }
  }
}

/** ⇄ between lanes; a small packet crosses it twice when the diagram first plays. */
function Gutter({ index }: { index: number }) {
  return (
    <div className="flex items-center justify-center pt-6 text-[16px] text-arrow">
      <span className="relative">
        ⇄
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
  const surface = bar.kind === 'data' ? 'border border-line bg-data' : 'border border-dashed border-dash-2';
  return (
    <div
      data-anim="fade-up"
      style={timing(at, 500)}
      className={`flex flex-wrap items-center gap-x-[22px] gap-y-2 rounded-[12px] px-4 py-3 text-[12.5px] text-strong ${surface}`}
    >
      <span className="mono text-[10.5px] tracking-[0.08em] text-muted">{bar.label}</span>
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

/** Architecture (README › 5). Scrolls horizontally below 1000px; the region is keyboard-scrollable. */
export function Architecture({ t, lanes, bars }: Props) {
  return (
    <section id="architecture" className="section-x py-24">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mx-auto mb-14 flex max-w-[720px] flex-col items-center gap-[14px] text-center">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="m-0 text-h2">{t.title}</h2>
          <p className="m-0 text-[16px] leading-[1.7] text-muted">{t.lead}</p>
        </Reveal>

        <Scene
          role="region"
          aria-label={t.diagramLabel}
          tabIndex={0}
          threshold={0.2}
          className="overflow-x-auto overscroll-x-contain pb-2"
        >
          <div className="flex min-w-[1000px] flex-col gap-[14px]">
            <div className="grid grid-cols-[1fr_26px_1.2fr_26px_1.2fr_26px_1fr_26px_1fr] items-stretch">
              {lanes.map((lane, i) => (
                <div key={lane.id} className="contents">
                  <div data-anim="fade-up" style={timing(i * 110, 520)} className="flex flex-col gap-2">
                    <div className={laneHeader}>{lane.label}</div>
                    {lane.boxes.map((box, j) => (
                      <Box key={j} box={box} />
                    ))}
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
