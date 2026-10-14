import { Scene } from '@/components/motion/Scene';
import { CountUp } from '@/components/ui/CountUp';
import { Bar, timing } from '@/components/ui/primitives';

/** Flagship 02. Timeline: question → sources counted → cited answer → evidence rows → follow-ups. */
const DB_TAG = {
  ThaiJO: 'text-success-ink bg-success-bg',
  PubMed: 'text-info-ink bg-info-bg',
  OpenAlex: 'text-warn-ink bg-warn-bg',
} as const;

const SOURCES: Array<{ n: number; db: keyof typeof DB_TAG; bar: string; meta: string; type: string }> = [
  { n: 1, db: 'ThaiJO', bar: '79%', meta: 'วารสารการแพทย์แผนไทยและการแพทย์ทางเลือก · 2564', type: 'RCT' },
  { n: 2, db: 'PubMed', bar: '86%', meta: 'Systematic review & meta-analysis · 2023', type: 'Review' },
  { n: 3, db: 'OpenAlex', bar: '93%', meta: 'Multicentre RCT · 2022', type: 'RCT' },
];

function Marker({ n, at }: { n: number; at: number }) {
  return (
    <span
      data-anim="pop"
      style={timing(at, 420)}
      className="mono inline-block rounded-[3px] bg-primary-tint px-1 text-[10px] text-primary"
    >
      {n}
    </span>
  );
}

const pill = 'flex items-center gap-1 rounded-full border border-line bg-white px-[7px] py-[2px] text-[10.5px] text-strong';

export function AssistantMock({ label }: { label: string }) {
  return (
    <Scene
      role="img"
      aria-label={label}
      className="overflow-hidden rounded-[14px] border border-line bg-white text-[12px] shadow-mock"
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-hair px-[14px] py-[10px]">
        <span className="font-medium text-ink">Research Assistant</span>
        <span className="mono ml-auto text-[10px] tracking-[0.06em] text-faint">SOURCES</span>
        {['ThaiJO', 'OpenAlex', 'PubMed'].map((s) => (
          <span key={s} className={pill}>
            <span className="size-[6px] rounded-full bg-success" />
            {s}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-[10px] p-[14px]">
        <div
          data-anim="fade-up"
          style={timing(0)}
          className="max-w-[85%] self-end rounded-[12px_12px_2px_12px] bg-primary px-3 py-2 text-white"
        >
          ฟ้าทะลายโจรมีประสิทธิผลในการรักษา COVID-19 อาการไม่รุนแรงหรือไม่
        </div>
        <div data-anim="fade" style={timing(400)} className="mono pl-1 text-[10.5px] text-muted">
          → retrieved <CountUp to={12} at={450} dur={700} /> sources · ThaiJO <CountUp to={7} at={450} dur={700} /> · PubMed{' '}
          <CountUp to={3} at={450} dur={700} /> · OpenAlex <CountUp to={2} at={450} dur={700} />
        </div>
        <div
          data-anim="fade-up"
          style={timing(1000)}
          className="flex max-w-[94%] flex-col gap-2 rounded-[2px_12px_12px_12px] bg-bubble px-3 py-[10px]"
        >
          <p className="m-0 text-[12px] leading-[1.7] text-strong">
            ผลการศึกษายังไม่สอดคล้องกัน การทดลองแบบสุ่มในไทยรายงานอุบัติการณ์ปอดอักเสบที่ต่ำลงในกลุ่มที่ได้รับสารสกัดฟ้าทะลายโจร{' '}
            <Marker n={1} at={1300} /> แต่การทบทวนอย่างเป็นระบบสรุปว่าหลักฐานยังไม่เพียงพอ <Marker n={2} at={1450} />{' '}
            และการทดลองหลายศูนย์ไม่พบความแตกต่างอย่างมีนัยสำคัญ <Marker n={3} at={1600} />
          </p>
          <div data-anim="fade" style={timing(1750)} className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-warn-bg px-2 py-[2px] text-[10.5px] text-warn-ink">ความเชื่อมั่นของหลักฐาน: ต่ำ</span>
            <span className="text-[10.5px] text-muted">3 แหล่งหลัก · ไทย 1 · สากล 2</span>
          </div>
        </div>
        <div className="flex flex-col">
          {SOURCES.map((s, i) => (
            <div
              key={s.n}
              data-anim="slide-x"
              style={timing(1850 + i * 100, 420)}
              className="grid grid-cols-[22px_auto_1fr_auto] items-center gap-2 border-t border-hair-2 py-[7px]"
            >
              <span className="mono text-[10px] text-primary">[{s.n}]</span>
              <span className={`rounded-[4px] px-[6px] py-[2px] text-[10px] font-medium ${DB_TAG[s.db]}`}>{s.db}</span>
              <div className="flex min-w-0 flex-col gap-1">
                <Bar w={s.bar} h={6} />
                <span className="truncate text-[10.5px] text-muted">{s.meta}</span>
              </div>
              <span className="rounded-full border border-line px-[7px] py-[2px] text-[10px] whitespace-nowrap text-strong">{s.type}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-[6px] border-t border-hair bg-surface-2 px-[14px] py-[10px]">
        {['เปรียบเทียบขนาดยาในแต่ละการศึกษา', 'มีการศึกษาในไทยปี 2566–2568 หรือไม่'].map((chip, i) => (
          <span
            key={chip}
            data-anim="fade-up"
            style={timing(2300 + i * 80)}
            className="rounded-full border border-primary-line bg-primary-tint px-[9px] py-1 text-[11px] text-primary"
          >
            {chip}
          </span>
        ))}
        <span data-anim="fade-up" style={timing(2460)} className="rounded-full border border-line px-[9px] py-1 text-[11px] text-strong">
          → ส่งไป Deep Research
        </span>
      </div>
    </Scene>
  );
}
