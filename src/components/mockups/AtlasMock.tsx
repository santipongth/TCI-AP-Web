import { Scene } from '@/components/motion/Scene';
import { CountUp } from '@/components/ui/CountUp';
import { SELECT_AT, TopicGraph } from './TopicGraph';

/** Flagship 06. Timeline: clusters grow one by one, then topic 05 is selected and its panel counts up. */
const LEGEND: Array<[string, string]> = [
  ['สาธารณสุข', 'bg-topic-health'],
  ['เกษตรและอาหาร', 'bg-topic-agri'],
  ['วิศวกรรม', 'bg-topic-eng'],
  ['ศึกษาศาสตร์', 'bg-topic-edu'],
  ['สังคมศาสตร์', 'bg-topic-social'],
];

const chip = 'rounded-full border border-line bg-white px-[7px] py-[2px] text-[10.5px] text-strong';
const label = 'mono text-[10px] tracking-[0.06em] text-faint';

function Stat({ children, caption, tone = 'text-ink' }: { children: React.ReactNode; caption: string; tone?: string }) {
  return (
    <div className="flex flex-col">
      <span className={`text-[14px] font-semibold ${tone}`}>{children}</span>
      <span className="text-[10.5px] text-muted">{caption}</span>
    </div>
  );
}

export function AtlasMock({ label: aria }: { label: string }) {
  const at = SELECT_AT + 100;
  return (
    <Scene
      role="img"
      aria-label={aria}
      threshold={0.3}
      className="overflow-hidden rounded-[18px] border border-line bg-white text-[12px] shadow-mock"
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-hair px-[14px] py-[10px]">
        <span className="font-medium text-ink">Research Atlas</span>
        <span className="mono text-[10.5px] text-muted">ThaiJO · 2565–2569</span>
        <span className="flex h-6 items-center gap-[6px] rounded-[6px] border border-line px-[10px] text-[11.5px] text-strong">
          ทุกสาขา <span className="text-faint">▾</span>
        </span>
        <span className="mono ml-auto text-[10.5px] text-muted">48 topics</span>
        <span className="flex overflow-hidden rounded-[6px] border border-line">
          <span className="grid size-6 place-items-center border-r border-line text-strong">−</span>
          <span className="grid size-6 place-items-center text-strong">+</span>
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))]">
        <div className="relative aspect-[520/340] min-w-0 bg-[radial-gradient(#ececf0_1px,transparent_1.2px)] bg-size-[14px_14px]">
          <TopicGraph />
        </div>
        <div className="flex max-w-[260px] flex-col gap-[10px] border-t border-l border-hair bg-surface p-[14px] @max-[520px]:max-w-none @max-[520px]:border-l-0">
          <div className={label}>TOPIC 05 · สาธารณสุข</div>
          <div className="text-[13.5px] leading-[1.35] font-semibold text-ink">PM2.5 และผลกระทบต่อสุขภาพ</div>
          <div className="grid grid-cols-2 gap-2">
            <Stat caption="บทความ">
              <CountUp to={1284} group at={at} dur={800} />
            </Stat>
            <Stat caption="วารสาร">
              <CountUp to={86} at={at} dur={800} />
            </Stat>
            <Stat caption="3 ปีล่าสุด" tone="text-success-ink">
              <CountUp to={38} prefix="↑ " suffix="%" at={at} dur={800} />
            </Stat>
            <Stat caption="ผู้นิพนธ์">
              <CountUp to={412} at={at} dur={800} />
            </Stat>
          </div>
          <div className={`${label} mt-[2px]`}>KEYWORDS</div>
          <div className="flex flex-wrap gap-1">
            {['ฝุ่นละออง', 'ภาคเหนือ', 'ทางเดินหายใจ', 'หมอกควัน'].map((k) => (
              <span key={k} className={chip}>
                {k}
              </span>
            ))}
          </div>
          <div className={`${label} mt-[2px]`}>LINKED TOPICS</div>
          <div className="flex flex-col gap-1 text-[11.5px] text-strong">
            <span className="flex items-center gap-[6px]">
              <span className="size-[7px] rounded-full bg-topic-eng" />
              T23 · วิศวกรรมสิ่งแวดล้อม
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="size-[7px] rounded-full bg-topic-social" />
              T43 · นโยบายสาธารณะ
            </span>
          </div>
          <span className="mt-auto text-[11.5px] font-medium text-primary">ดูบทความทั้งหมด →</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[14px] border-t border-hair bg-surface-2 px-[14px] py-[10px] text-[11px] text-strong">
        {LEGEND.map(([name, dot]) => (
          <span key={name} className="flex items-center gap-[5px]">
            <span className={`size-2 rounded-full ${dot}`} />
            {name}
          </span>
        ))}
        <span className="mono ml-auto text-[10px] text-faint">size = articles · edge = co-citation</span>
      </div>
    </Scene>
  );
}
