import Image, { type StaticImageData } from 'next/image';
import nectecLogo from '@/assets/logos/nectec.png';
import nstdaLogo from '@/assets/logos/nstda.png';
import tciLogo from '@/assets/logos/tci.png';
import { siteConfig } from '@/config/site';
import { Reveal } from '@/components/ui/primitives';

type Org = 'TCI' | 'NECTEC' | 'NSTDA';

interface Props {
  t: { developedBy: string; orgs: string; copyright: string; partnersLabel: string; logoLabels: Record<Org, string> };
}

/**
 * Display sizes give each mark roughly the same visual area (~4,200 px²) inside the
 * 200×72 slot, so the squarer TCI mark does not look smaller than the wide NECTEC /
 * NSTDA wordmarks; TCI gets ~20% extra because its fine sub-lines read lighter.
 * Sources are trimmed of transparent padding and are ≥2.2× these sizes.
 */
const LOGOS: Array<{ org: Org; src: StaticImageData; width: number; height: number; href: string }> = [
  { org: 'TCI', src: tciLogo, width: 100, height: 52, href: siteConfig.links.tci },
  { org: 'NECTEC', src: nectecLogo, width: 115, height: 36, href: siteConfig.links.nectec },
  { org: 'NSTDA', src: nstdaLogo, width: 113, height: 37, href: siteConfig.links.nstda },
];

export function SiteFooter({ t }: Props) {
  const { links } = siteConfig;
  const partners = [
    ['ThaiJO', links.thaijo],
    ['TCI', links.tci],
    ['NECTEC', links.nectec],
    ['NSTDA', links.nstda],
    ['Agenta AI', links.agenta],
  ] as const;

  return (
    <footer className="section-x border-t border-divider bg-white pt-14 pb-10">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10">
        <Reveal className="flex flex-col items-center gap-[18px] text-center">
          <div className="mono text-[11.5px] tracking-[0.08em] text-subtle uppercase">{t.developedBy}</div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {LOGOS.map(({ org, src, width, height, href }) => (
              <a
                key={org}
                href={href}
                aria-label={t.logoLabels[org]}
                className="grid h-[72px] w-[200px] place-items-center rounded-[10px] border border-line bg-white transition-[border-color,box-shadow,translate] duration-200 hover:border-primary-line-hover hover:shadow-lift motion-safe:hover:-translate-y-0.5"
              >
                <Image src={src} alt="" width={width} height={height} style={{ width, height }} />
              </a>
            ))}
          </div>
          <p className="m-0 max-w-[640px] text-[13px] leading-[1.7] text-muted">{t.orgs}</p>
        </Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[13px] text-muted">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="grid size-[22px] place-items-center rounded-[6px] bg-primary text-[11px] font-bold text-white">
              T
            </span>
            {t.copyright}
          </div>
          <nav aria-label={t.partnersLabel} className="flex flex-wrap gap-5">
            {partners.map(([label, href]) => (
              <a key={label} href={href} className="text-muted">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
