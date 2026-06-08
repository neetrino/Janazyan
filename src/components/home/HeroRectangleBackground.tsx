import type { HeroSlideBackground } from './hero-slides';

const HERO_RECTANGLE_TOP_PERCENT = 5.96;
const HERO_RECTANGLE_BOTTOM_PERCENT = 3.4;

const HERO_RECTANGLE_PATH =
  'M0 125.383C0 108.262 13.8792 94.3832 31 94.3832H805C822.121 94.3832 836 80.5041 836 63.3832V31C836 13.8792 849.879 0 867 0H1357C1374.12 0 1388 13.8792 1388 31V821C1388 838.121 1374.12 852 1357 852H31C13.8792 852 0 838.121 0 821V125.383Z';

type HeroRectangleBackgroundProps = {
  variant: HeroSlideBackground;
  className?: string;
  /** Stretch gradient to fill the parent (e.g. growing products catalog shell). */
  fill?: boolean;
};

export function HeroRectangleBackground({
  variant,
  className = '',
  fill = false,
}: HeroRectangleBackgroundProps) {
  const gradientId = `hero-rectangle-gradient-${variant}`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-[1] transition-opacity duration-500 ${
        fill ? 'inset-0' : 'inset-x-0'
      } ${className}`}
      style={
        fill
          ? undefined
          : {
              bottom: `${HERO_RECTANGLE_BOTTOM_PERCENT}%`,
              top: `${HERO_RECTANGLE_TOP_PERCENT}%`,
            }
      }
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1388 852"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={HERO_RECTANGLE_PATH} fill={`url(#${gradientId})`} />
        <defs>
          {variant === 'blue' ? (
            <linearGradient
              id={gradientId}
              x1="198"
              y1="109.873"
              x2="1397.46"
              y2="988.619"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#93B6E3" />
              <stop offset="1" stopColor="#FCF8EC" />
            </linearGradient>
          ) : (
            <linearGradient
              id={gradientId}
              x1="198"
              y1="109.873"
              x2="1397.46"
              y2="988.619"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F5C8CE" />
              <stop offset="0.6485" stopColor="#BCD4EC" />
            </linearGradient>
          )}
        </defs>
      </svg>
    </div>
  );
}
