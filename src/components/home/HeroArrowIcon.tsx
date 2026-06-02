import { HERO_ARROW_SIZE_PX } from './hero-slides';

const HERO_ARROW_PATH =
  'M21.9393 30.9393C21.3536 31.5251 21.3536 32.4749 21.9393 33.0607L31.4853 42.6066C32.0711 43.1924 33.0208 43.1924 33.6066 42.6066C34.1924 42.0208 34.1924 41.0711 33.6066 40.4853L25.1213 32L33.6066 23.5147C34.1924 22.9289 34.1924 21.9792 33.6066 21.3934C33.0208 20.8076 32.0711 20.8076 31.4853 21.3934L21.9393 30.9393ZM41 32V30.5L23 30.5V32V33.5H41V32Z';

const HERO_ARROW_NAV_SIZE_PX = HERO_ARROW_SIZE_PX;
const HERO_ARROW_BUTTON_SIZE_PX = 24;

type HeroArrowIconProps = {
  direction?: 'left' | 'right';
  size?: number;
  className?: string;
};

export function HeroArrowIcon({
  direction = 'right',
  size = HERO_ARROW_NAV_SIZE_PX,
  className = '',
}: HeroArrowIconProps) {
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-white shadow-soft" />
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className={`relative ${direction === 'right' ? 'rotate-180' : ''}`}
      >
        <path d={HERO_ARROW_PATH} fill="#93B6E3" />
      </svg>
    </span>
  );
}

export function HeroArrowButtonIcon({ className = '' }: { className?: string }) {
  return (
    <HeroArrowIcon direction="right" size={HERO_ARROW_BUTTON_SIZE_PX} className={className} />
  );
}
