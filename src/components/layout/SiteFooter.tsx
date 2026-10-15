import Image, { type StaticImageData } from 'next/image';
import nectecLogo from '@/assets/logos/nectec.png';
import nstdaLogo from '@/assets/logos/nstda.png';
import tciLogo from '@/assets/logos/tci.png';
import { siteConfig } from '@/config/site';
import { BrandMark } from '@/components/ui/BrandMark';
import { Reveal } from '@/components/ui/primitives';

type Org = 'TCI' | 'NECTEC' | 'NSTDA';

interface Props {
  t: {
    developedBy: string;
    copyright: string;
    partnersLabel: string;
    orgNames: Record<Org, string>;
    logoLabels: Record<Org, string>;
  };
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
  ] as const;

  return (
    <footer className="section-x border-t border-divider bg-[linear-gradient(180deg,#fafafb,#f4f3ff)] pt-16 pb-10">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <div className="mono text-[11.5px] tracking-[0.08em] text-subtle uppercase">{t.developedBy}</div>
          {/* Each organisation: logo card with its full name directly underneath. */}
          <ul className="m-0 flex list-none flex-wrap items-start justify-center gap-x-5 gap-y-8 p-0">
            {LOGOS.map(({ org, src, width, height, href }) => (
              <li key={org} className="flex w-[200px] flex-col items-center gap-3">
                <a
                  href={href}
                  aria-label={t.logoLabels[org]}
                  className="grid h-[76px] w-full place-items-center rounded-[16px] border border-line bg-white shadow-card transition-[border-color,box-shadow,translate] duration-200 hover:border-primary-line-hover hover:shadow-lift motion-safe:hover:-translate-y-0.5"
                >
                  <Image src={src} alt="" width={width} height={height} style={{ width, height }} />
                </a>
                <span className="text-[12.5px] leading-[1.6] text-balance text-muted">{t.orgNames[org]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="flex flex-col items-center gap-4 border-t border-line pt-6 text-[13px] text-muted sm:flex-row sm:flex-wrap sm:justify-between">
          <div className="flex items-center gap-2">
            <BrandMark className="size-[24px] flex-none" />
            {t.copyright}
          </div>
          <nav aria-label={t.partnersLabel} className="flex flex-wrap justify-center gap-5">
            {partners.map(([label, href]) => (
              <a key={label} href={href} className="inline-flex min-h-11 items-center text-muted sm:min-h-0">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
