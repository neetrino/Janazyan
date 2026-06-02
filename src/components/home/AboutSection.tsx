import type { CSSProperties } from 'react';
import { ABOUT_STATS } from './constants';

/** Figma Mirage 100px — display font at 72px for visual parity without Mirage webfont. */
const ABOUT_HEADING_CLASS = 'font-display font-normal';
const ABOUT_IMAGE = '/figma/about-hero.png';

/** Extra space below desktop about content before footer overlap. */
const ABOUT_DESKTOP_FOOTER_GAP_PX = 80;
const ABOUT_DESKTOP_HEIGHT_PX = 1017;
const ABOUT_DESKTOP_TOTAL_HEIGHT_PX = ABOUT_DESKTOP_HEIGHT_PX + ABOUT_DESKTOP_FOOTER_GAP_PX;

const ABOUT_BG_STYLE: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1470 1017' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-1.85 -44.9 64.9 -2.674 694.5 537)'><stop stop-color='rgba(227,206,250,1)' offset='0'/><stop stop-color='rgba(239,247,255,1)' offset='0.75962'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>\")",
};

export function AboutSection() {
  return (
    <section
      aria-label="About Janazyan"
      className="relative w-full overflow-hidden px-2 py-16 font-armenian sm:px-3 md:px-4 md:py-24 lg:p-0"
      style={ABOUT_BG_STYLE}
    >
      <MobileAbout />
      <DesktopAbout />
    </section>
  );
}

function MobileAbout() {
  return (
    <div className="mx-auto w-full max-w-[1470px] lg:hidden">
      <div className="text-center">
        <h2
          className={`${ABOUT_HEADING_CLASS} text-[clamp(32px,6vw,56px)] leading-[0.9] tracking-[0.3691px] text-ink-800`}
        >
          Ծնված Սիրուց
        </h2>
        <h2
          className={`${ABOUT_HEADING_CLASS} mt-2 text-[clamp(32px,6vw,56px)] leading-[0.9] tracking-[0.3691px] text-sky-soft`}
        >
          Ստեղծված Խնամքով
        </h2>
      </div>

      <div className="relative mx-auto mt-10 h-[420px] w-full max-w-[560px] sm:h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ABOUT_IMAGE}
          alt="Janazyan products"
          className="mx-auto h-full w-full object-contain mix-blend-screen"
        />
      </div>

      <div className="relative mt-10 grid gap-10 md:mt-12 md:grid-cols-3 md:items-center">
        <div className="space-y-12 text-center md:text-right">
          <p className="mx-auto max-w-[352px] text-[16px] leading-[26px] tracking-[-0.3125px] text-ink-500">
            Մեր ուշադիր ընտրված հավաքածուն համատեղում է անվտանգությունը, կայունությունը և ոճը։ Յուրաքանչյուր արտադրանք մտածված կերպով ընտրված է և խստորեն փորձարկված՝ համապատասխանելու որակի և հարմարավետության բարձրագույն չափանիշներին։
          </p>
          <Stat value={ABOUT_STATS[0].value} label={ABOUT_STATS[0].label} />
        </div>

        <div className="relative mx-auto flex justify-center">
          <Stat value={ABOUT_STATS[1].value} label={ABOUT_STATS[1].label} />
        </div>

        <div className="space-y-12 text-center md:text-left">
          <Stat
            value={ABOUT_STATS[2].value}
            label={ABOUT_STATS[2].label}
            align="left"
          />
          <p className="mx-auto max-w-[433px] text-[18px] leading-[29.25px] tracking-[-0.4395px] text-ink-500">
            Փոքրիկ Ծաղիկը հիմնադրվել է ծնողների կողմից, ովքեր հասկանում են նոր կյանքի խնամքի ճանապարհը։ Մենք հավատում ենք, որ յուրաքանչյուր երեխա արժանի է ամենանուրբ խնամքին, և յուրաքանչյուր ծնող արժանի է հանգստության։
          </p>
        </div>
      </div>
    </div>
  );
}

function DesktopAbout() {
  return (
    <div className="mx-auto hidden w-full lg:block">
      <div
        className="flex justify-center overflow-hidden"
        style={{
          height: `calc(${ABOUT_DESKTOP_TOTAL_HEIGHT_PX}px * min(1, 100vw / 1470px))`,
        }}
      >
        <div
          className="relative w-[1470px] origin-top [transform:scale(min(1,calc(100vw/1470px)))]"
          style={{ height: ABOUT_DESKTOP_TOTAL_HEIGHT_PX }}
        >
        <div
          aria-hidden
          className="pointer-events-none absolute left-[403px] top-[118px] z-[3] h-[798px] w-[598px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ABOUT_IMAGE}
            alt=""
            className="size-full max-w-none object-cover mix-blend-screen"
          />
        </div>

        <p
          className={`absolute left-[316px] top-[118px] z-[2] whitespace-nowrap text-[72px] leading-[64px] tracking-[0.3691px] text-sky-soft ${ABOUT_HEADING_CLASS}`}
        >
          Ստեղծված Խնամքով
        </p>

        <p
          className={`absolute left-[1059px] top-[48px] z-[2] -translate-x-full whitespace-nowrap text-right text-[72px] leading-[58px] tracking-[0.3691px] text-ink-800 ${ABOUT_HEADING_CLASS}`}
        >
          Ծնված Սիրուց
        </p>

        <p className="absolute left-[950px] top-[323px] z-[2] w-[433px] text-[18px] leading-[29.25px] tracking-[-0.4395px] text-ink-500">
          Փոքրիկ Ծաղիկը հիմնադրվել է ծնողների կողմից, ովքեր հասկանում են նոր կյանքի ճանապարհը։ Մենք հավատում ենք, որ յուրաքանչյուր երեխա արժանի է ամենանուրբ խնամքին, և յուրաքանչյուր ծնող արժանի է հանգստության։
        </p>

        <p className="absolute left-[484px] top-[228px] z-[2] w-[352px] -translate-x-full text-right text-[16px] leading-[26px] tracking-[-0.3125px] text-ink-500">
          Մեր ուշադիր ընտրված հավաքածուն համատեղում է անվտանգությունը, կայունությունը և ոճը։ Յուրաքանչյուր արտադրանք մտածված կերպով ընտրված է և խստորեն փորձարկված՝ համապատասխանելու որակի և հարմարավետության բարձրագույն չափանիշներին։
        </p>

        <div className="absolute left-[254px] top-[548px] z-[2] w-[149px]">
          <Stat value={ABOUT_STATS[0].value} label={ABOUT_STATS[0].label} />
        </div>

        <div className="absolute left-[577px] top-[796px] z-[2] w-[99px]">
          <Stat value={ABOUT_STATS[1].value} label={ABOUT_STATS[1].label} />
        </div>

        <div className="absolute left-[1044px] top-[579px] z-[2] w-[115px]">
          <Stat value={ABOUT_STATS[2].value} label={ABOUT_STATS[2].label} />
        </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  align = 'center',
}: {
  value: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}) {
  const alignClass =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-center text-center';

  return (
    <div className={`flex flex-col gap-[4px] ${alignClass}`}>
      <span className="whitespace-nowrap text-[30px] font-black leading-[36px] tracking-[0.3955px] text-sky-soft">
        {value}
      </span>
      <span className="whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.1504px] text-ink-500">
        {label}
      </span>
    </div>
  );
}
