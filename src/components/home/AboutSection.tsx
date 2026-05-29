import Image from 'next/image';
import { ABOUT_STATS } from './constants';

const ABOUT_HEADING_CLASS =
  'font-armenian font-black tracking-[0.0037em]';
const ABOUT_IMAGE = '/figma/cosmetic-hero.png';

export function AboutSection() {
  return (
    <section
      aria-label="About Janazyan"
      className="relative w-full px-2 py-16 font-armenian sm:px-3 md:px-4 md:py-24 lg:h-[1017px] lg:py-0"
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
          className={`${ABOUT_HEADING_CLASS} text-ink-800 text-[clamp(40px,8vw,76px)] leading-[0.9]`}
        >
          Ծնված Սիրուց
        </h2>
        <h2
          className={`${ABOUT_HEADING_CLASS} mt-2 text-sky-soft text-[clamp(40px,8vw,76px)] leading-[0.9]`}
        >
          Ստեղծված Խնամքով
        </h2>
      </div>

      <div className="relative mt-10 grid gap-10 md:mt-12 md:grid-cols-3 md:items-center">
        <div className="space-y-12 text-center md:text-right">
          <p className="mx-auto max-w-[352px] text-[16px] leading-[26px] tracking-[-0.02em] text-ink-500">
            Մեր ուշադիր ընտրված հավաքածուն համատեղում է անվտանգությունը, կայունությունը և ոճը։ Յուրաքանչյուր արտադրանք մտածված կերպով ընտրված է և խստորեն փորձարկված՝ համապատասխանելու որակի և հարմարավետության բարձրագույն չափանիշներին։
          </p>
          <Stat value={ABOUT_STATS[0].value} label={ABOUT_STATS[0].label} />
        </div>

        <div className="relative mx-auto h-[520px] w-full max-w-[560px] overflow-hidden md:h-[620px]">
          <Image
            src={ABOUT_IMAGE}
            alt="Janazyan products"
            fill
            sizes="(max-width: 1024px) 90vw, 560px"
            className="object-cover object-center"
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <Stat value={ABOUT_STATS[1].value} label={ABOUT_STATS[1].label} />
          </div>
        </div>

        <div className="space-y-12 text-center md:text-left">
          <Stat
            value={ABOUT_STATS[2].value}
            label={ABOUT_STATS[2].label}
            align="left"
          />
          <p className="mx-auto max-w-[433px] text-[18px] leading-[29px] tracking-[-0.02em] text-ink-500">
            Փոքրիկ Ծաղիկը հիմնադրվել է ծնողների կողմից, ովքեր հասկանում են նոր կյանքի խնամքի ճանապարհը։ Մենք հավատում ենք, որ յուրաքանչյուր երեխա արժանի է ամենանուրբ խնամքին, և յուրաքանչյուր ծնող արժանի է հանգստության։
          </p>
        </div>
      </div>
    </div>
  );
}

function DesktopAbout() {
  return (
    <div className="relative mx-auto hidden h-[1017px] w-full max-w-[1470px] lg:block">
      <h2
        className={`absolute left-[316px] top-[118px] whitespace-nowrap text-[100px] leading-[90px] text-sky-soft ${ABOUT_HEADING_CLASS}`}
      >
        Ստեղծված Խնամքով
      </h2>

      <div className="pointer-events-none absolute left-[417px] top-[149px] h-[839px] w-[670px] overflow-hidden">
        <div className="absolute left-0 top-[-24.77%] h-[141.92%] w-full">
          <Image
            src={ABOUT_IMAGE}
            alt="Janazyan products"
            fill
            sizes="670px"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>

      <p className="absolute left-[953px] top-[356px] w-[433px] text-[18px] leading-[29.25px] tracking-[-0.0244em] text-ink-500">
        Փոքրիկ Ծաղիկը հիմնադրվել է ծնողների կողմից, ովքեր հասկանում են նոր կյանքի խնամքի ճանապարհը։ Մենք հավատում ենք, որ յուրաքանչյուր երեխա արժանի է ամենանուրբ խնամքին, և յուրաքանչյուր ծնող արժանի է հանգստության։
      </p>

      <p className="absolute left-[132px] top-[228px] w-[352px] text-right text-[16px] leading-[26px] tracking-[-0.0195em] text-ink-500">
        Մեր ուշադիր ընտրված հավաքածուն համատեղում է անվտանգությունը, կայունությունը և ոճը։ Յուրաքանչյուր արտադրանք մտածված կերպով ընտրված է և խստորեն փորձարկված՝ համապատասխանելու որակի և հարմարավետության բարձրագույն չափանիշներին։
      </p>

      <div className="absolute left-[211px] top-[621px] w-[149px]">
        <Stat value={ABOUT_STATS[0].value} label={ABOUT_STATS[0].label} />
      </div>

      <div className="absolute left-[577px] top-[796px] w-[99px]">
        <Stat value={ABOUT_STATS[1].value} label={ABOUT_STATS[1].label} />
      </div>

      <div className="absolute left-[1087px] top-[646px] w-[115px]">
        <Stat value={ABOUT_STATS[2].value} label={ABOUT_STATS[2].label} />
      </div>

      <h2
        className={`absolute left-[390px] top-[48px] whitespace-nowrap text-right text-[100px] leading-[80px] text-ink-800 ${ABOUT_HEADING_CLASS}`}
      >
        Ծնված Սիրուց
      </h2>
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
    <div className={`flex flex-col gap-1 ${alignClass}`}>
      <span className="text-[30px] font-black leading-[36px] tracking-[0.013em] text-sky-soft">
        {value}
      </span>
      <span className="text-[14px] leading-[20px] tracking-[-0.011em] text-ink-500">
        {label}
      </span>
    </div>
  );
}
