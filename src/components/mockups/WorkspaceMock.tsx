import { Scene } from '@/components/motion/Scene';
import { Bar, timing } from '@/components/ui/primitives';

/** Flagship 01. Timeline: question → agent trace streams → MCPs light up as called → cited answer. */
const MCPS: Array<[name: string, calledAt: number]> = [
  ['ThaiJO Search', 850],
  ['Article MCP', 2150],
  ['Journal MCP', 2250],
  ['Author MCP', 1250],
  ['Citation MCP', 2050],
  ['Scholarly MCP', 1650],
];

const TRACE: Array<[line: string, at: number]> = [
  ['→ plan: 3 subtasks', 450],
  ['→ subagent: thaijo.search(q="PM2.5 ภาคเหนือ", years=5) · 24 results', 850],
  ['→ subagent: author.lookup(top=5)', 1250],
  ['→ re-plan: + scholarly.search (cohort < 5)', 1650],
  ['→ synthesize(citations=true)', 2050],
];

export function WorkspaceMock({ label }: { label: string }) {
  return (
    <Scene
      role="img"
      aria-label={label}
      className="overflow-hidden rounded-[14px] border border-line bg-white text-[12px] shadow-mock"
    >
      <div className="flex items-center gap-2 border-b border-hair px-[14px] py-[10px] text-muted">
        <span className="size-2 rounded-full bg-window-dot" />
        <span className="size-2 rounded-full bg-window-dot" />
        <span className="size-2 rounded-full bg-window-dot" />
        <span className="ml-2 font-medium text-ink">Agentic Workspace</span>
        <span className="mono ml-auto text-[10.5px]">session · pm25-north</span>
      </div>
      <div className="grid min-h-[260px] grid-cols-[150px_1fr]">
        <div className="flex flex-col gap-[6px] border-r border-hair bg-surface p-3">
          <div className="mono mb-1 text-[10px] tracking-[0.06em] text-faint">CONNECTED MCPS</div>
          {MCPS.map(([name, at]) => (
            <div key={name} className="flex items-center gap-[7px] text-strong">
              <span data-anim="dot-on" style={timing(at, 300)} className="size-[6px] flex-none rounded-full bg-success" />
              {name}
            </div>
          ))}
          <div className="mt-1 flex items-center gap-[7px] rounded-[6px] border border-dashed border-dash-3 px-[6px] py-1 text-faint">
            + register skill
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-[10px] p-[14px]">
          <div
            data-anim="fade-up"
            style={timing(0)}
            className="max-w-[85%] self-end rounded-[12px_12px_2px_12px] bg-primary px-3 py-2 text-white"
          >
            สรุปงานวิจัย PM2.5 ภาคเหนือ 5 ปีล่าสุดจาก ThaiJO
          </div>
          <div className="mono flex flex-col gap-[3px] pl-1 text-[10.5px] text-muted [overflow-wrap:anywhere]">
            {TRACE.map(([line, at]) => (
              <span key={line} data-anim="slide-x" style={timing(at, 380)}>
                {line}
              </span>
            ))}
          </div>
          <div
            data-anim="fade-up"
            style={timing(2300)}
            className="flex max-w-[92%] flex-col gap-[6px] rounded-[2px_12px_12px_12px] bg-bubble px-3 py-[10px]"
          >
            <Bar w="92%" anim="grow-x" d={2400} dur={420} />
            <Bar w="84%" anim="grow-x" d={2500} dur={420} />
            <Bar w="70%" anim="grow-x" d={2600} dur={420} />
            <div className="mt-1 flex gap-[5px]">
              {['[1] ThaiJO', '[2]', '[3]'].map((chip, i) => (
                <span
                  key={chip}
                  data-anim="pop"
                  style={timing(2850 + i * 80, 380)}
                  className="mono rounded-[4px] border border-line bg-white px-[6px] py-[2px] text-[10px]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}
