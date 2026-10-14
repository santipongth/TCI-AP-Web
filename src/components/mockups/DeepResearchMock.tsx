import { Scene } from '@/components/motion/Scene';
import { CountUp } from '@/components/ui/CountUp';
import { Bar, timing } from '@/components/ui/primitives';

/** Flagship 04. Timeline: plan steps tick done one by one, step 4 keeps running, the report drafts itself. */
const STEP_MS = 450;

const icon = 'col-start-1 row-start-1 grid size-4 place-items-center rounded-full text-[10px] text-white';

/** Outline (pending) underneath; "running" and "done" layers are revealed on schedule. */
function StepIcon({ state, index }: { state: 'done' | 'running' | 'pending'; index: number }) {
  const start = index * STEP_MS;
  return (
    <span className="grid flex-none">
      <span className="col-start-1 row-start-1 size-4 rounded-full border border-dash-3" />
      {state === 'done' && (
        <>
          <span data-anim="blip" style={timing(start, STEP_MS)} className={`${icon} bg-primary`}>
            …
          </span>
          <span data-anim="pop" style={timing(start + STEP_MS, 360)} className={`${icon} bg-success`}>
            ✓
          </span>
        </>
      )}
      {state === 'running' && (
        <span data-anim="pop" style={timing(start, 360)} className={`${icon} bg-primary`}>
          …
        </span>
      )}
    </span>
  );
}

const STEPS: Array<{ label: React.ReactNode; state: 'done' | 'running' | 'pending' }> = [
  { label: 'วางแผนการค้น', state: 'done' },
  { label: 'ค้น ThaiJO · 142', state: 'done' },
  { label: 'ค้น OpenAlex · PubMed · 61', state: 'done' },
  {
    label: (
      <>
        อ่านเชิงลึก <CountUp to={18} at={3 * STEP_MS} dur={1200} suffix=" / 24" />
      </>
    ),
    state: 'running',
  },
  { label: 'สังเคราะห์รายงาน', state: 'pending' },
];

function Cite({ children, at }: { children: string; at: number }) {
  return (
    <span data-anim="pop" style={timing(at, 360)} className="mono rounded-[3px] bg-primary-tint px-[5px] py-px text-[10px] text-primary">
      {children}
    </span>
  );
}

const BAR = (i: number) => 450 + i * 170;

export function DeepResearchMock({ label }: { label: string }) {
  return (
    <Scene
      role="img"
      aria-label={label}
      className="grid min-h-[280px] grid-cols-[170px_1fr] overflow-hidden rounded-[14px] border border-line bg-white text-[12px] shadow-mock"
    >
      <div className="flex flex-col gap-3 border-r border-hair bg-surface p-[14px]">
        <div className="mono text-[10px] tracking-[0.06em] text-faint">RESEARCH PLAN</div>
        {STEPS.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 ${s.state === 'pending' ? 'text-faint' : 'text-ink'}`}>
            <StepIcon state={s.state} index={i} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-[9px] px-5 py-[18px]">
        <div data-anim="fade" style={timing(200)} className="text-[13px] font-semibold text-ink">
          ผลกระทบของ PM2.5 ต่อสุขภาพในภาคเหนือ: การทบทวน
        </div>
        <Bar w="96%" anim="grow-x" d={BAR(0)} dur={420} />
        <Bar w="90%" anim="grow-x" d={BAR(1)} dur={420} />
        <div className="flex items-center gap-[6px]">
          <Bar w="60%" anim="grow-x" d={BAR(2)} dur={420} />
          <Cite at={BAR(2) + 380}>[4]</Cite>
          <Cite at={BAR(2) + 460}>[7]</Cite>
        </div>
        <Bar w="94%" anim="grow-x" d={BAR(3)} dur={420} />
        <div className="flex items-center gap-[6px]">
          <Bar w="48%" anim="grow-x" d={BAR(4)} dur={420} />
          <Cite at={BAR(4) + 380}>[12]</Cite>
        </div>
        <div className="mono mt-[6px] flex flex-col gap-1 border-t border-hair pt-[10px] text-[10px] text-muted">
          {['[4] วารสารสาธารณสุขศาสตร์ · 2566 · thaijo', '[7] Chiang Mai Med J · 2565 · thaijo', '[12] Environ Res · 2024 · openalex'].map(
            (ref, i) => (
              <span key={ref} data-anim="fade" style={timing(1800 + i * 120)}>
                {ref}
              </span>
            ),
          )}
        </div>
      </div>
    </Scene>
  );
}
