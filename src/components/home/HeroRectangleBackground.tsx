import { useId } from 'react';
import type { HeroSlideBackground } from './hero-slides';
import {
  HERO_RECTANGLE_BG_SRC,
  HERO_RECTANGLE_BOTTOM_PERCENT,
  HERO_RECTANGLE_PATH,
  HERO_RECTANGLE_TOP_PERCENT,
  HERO_RECTANGLE_VIEWBOX_HEIGHT,
  HERO_RECTANGLE_VIEWBOX_WIDTH,
} from './hero-rectangle-background.constants';

type HeroRectangleBackgroundProps = {
  variant: HeroSlideBackground;
  className?: string;
  /** Stretch gradient to fill the parent (e.g. growing products catalog shell). */
  fill?: boolean;
  /** When set, fills the shape with a single solid color instead of the gradient. */
  solidColor?: string;
};

function HeroRectangleGradientDefs({
  gradientId,
  variant,
}: {
  gradientId: string;
  variant: HeroSlideBackground;
}) {
  if (variant === 'blue') {
    return (
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
    );
  }

  return (
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
  );
}

export function HeroRectangleBackground({
  variant,
  className = '',
  fill = false,
  solidColor,
}: HeroRectangleBackgroundProps) {
  const clipId = useId();
  const gradientId = `${clipId}-gradient`;
  const useRasterBlue = variant === 'blue' && !solidColor;
  const pathFill = solidColor ?? `url(#${gradientId})`;

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
        viewBox={`0 0 ${HERO_RECTANGLE_VIEWBOX_WIDTH} ${HERO_RECTANGLE_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={HERO_RECTANGLE_PATH} />
          </clipPath>
          {!useRasterBlue ? <HeroRectangleGradientDefs gradientId={gradientId} variant={variant} /> : null}
        </defs>
        {useRasterBlue ? (
          <image
            href={HERO_RECTANGLE_BG_SRC}
            width={HERO_RECTANGLE_VIEWBOX_WIDTH}
            height={HERO_RECTANGLE_VIEWBOX_HEIGHT}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <path d={HERO_RECTANGLE_PATH} fill={pathFill} />
        )}
      </svg>
    </div>
  );
}
