import { Scene } from '@/components/motion/Scene';
import { CountUp } from '@/components/ui/CountUp';
import { Bar, timing } from '@/components/ui/primitives';

/** Flagship 03. Timeline: a scan line sweeps the list; each row flips from "checking" to its verdict. */
type Tone = 'ok' | 'warn' | 'error';

const ROWS: Array<{ n: string; a: string; b: string; tone: Tone; status: string; row?: 'warn' | 'error' }> = [
  { n: '01', a: '88%', b: '50%', tone: 'ok', status: '✓ Verified · DOI' },
  { n: '02', a: '76%', b: '40%', tone: 'ok', status: '✓ Verified · ThaiJO' },
  { n: '03', a: '82%', b: '46%', tone: 'warn', status: '⚠ ปีตีพิมพ์ไม่ตรง 2563 → 2564', row: 'warn' },
  { n: '04', a: '70%', b: '38%', tone: 'error', status: '✕ ถูกถอน (Retracted) · Crossref' },
  { n: '05', a: '64%', b: '30%', tone: 'error', status: '✕ ไม่พบใน ThaiJO / Crossref', row: 'error' },
];

const PILL: Record<Tone, string> = {
  ok: 'text-success-ink bg-success-bg',
  warn: 'text-warn-ink bg-warn-bg',
  error: 'text-error-ink bg-error-bg',
};

const ROW_BG = { warn: 'bg-warn-row', error: 'bg-error-row' } as const;

const SCAN_START = 150;
const SCAN_DUR = 2000;
const flipAt = (i: number) => 400 + i * 400;

export function RefsMock({ label }: { label: string }) {
  return (
    <Scene
      role="img"
      aria-label={label}
      className="overflow-hidden rounded-[18px] border border-line bg-white text-[12px] shadow-mock"
    >
      <div className="flex items-center gap-[10px] border-b border-hair px-[14px] py-3">
        <span className="mono rounded-[5px] bg-bubble px-[7px] py-[3px] text-[10.5px]">manuscript_v3.pdf</span>
        <span className="text-muted">32 รายการอ้างอิง</span>
        <span className="ml-auto font-medium text-success">
          <CountUp to={28} at={SCAN_START} dur={SCAN_DUR - 100} suffix=" / 32 verified" />
        </span>
      </div>
      <div className="relative flex flex-col">
        {/* Scan line: a full-size layer that slides from top to bottom once. */}
        <div
          aria-hidden="true"
          data-anim="scan"
          style={timing(SCAN_START, SCAN_DUR)}
          className="pointer-events-none absolute inset-0 z-[1]"
        >
          <div className="absolute inset-x-0 top-0 h-8 -translate-y-full border-b border-primary/50 bg-linear-to-b from-transparent to-primary-tint/80" />
        </div>
        {ROWS.map((r, i) => (
          <div
            key={r.n}
            data-anim={r.row ? 'tint' : undefined}
            style={r.row ? timing(flipAt(i), 300) : undefined}
            className={`grid grid-cols-[28px_1fr_auto] items-center gap-3 px-[14px] py-[10px] ${
              i < ROWS.length - 1 ? 'border-b border-hair-3' : ''
            } ${r.row ? ROW_BG[r.row] : ''}`}
          >
            <span className="mono text-faint">{r.n}</span>
            <div className="flex flex-col gap-[5px]">
              <Bar w={r.a} />
              <Bar w={r.b} h={6} tone="skel-2" />
            </div>
            <div className="grid justify-items-end">
              <span
                data-anim="blip"
                style={timing(0, flipAt(i))}
                className="col-start-1 row-start-1 rounded-full bg-bubble px-2 py-[3px] text-[11px] whitespace-nowrap text-muted"
              >
                กำลังตรวจ…
              </span>
              <span
                data-anim="pop"
                style={timing(flipAt(i), 360)}
                className={`col-start-1 row-start-1 rounded-full px-2 py-[3px] text-[11px] ${PILL[r.tone]}`}
              >
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-hair bg-surface-2 px-[14px] py-3">
        <span data-anim="fade-up" style={timing(2350)} className="rounded-full bg-primary px-3 py-[6px] text-[11.5px] text-white">
          แก้ไขอัตโนมัติ 2 รายการ
        </span>
        <span data-anim="fade-up" style={timing(2430)} className="rounded-full border border-line px-3 py-[6px] text-[11.5px] text-strong">
          Export BibTeX / RIS
        </span>
      </div>
    </Scene>
  );
}
