const HERO_RECTANGLE_TOP_PERCENT = 5.96;
const HERO_RECTANGLE_BOTTOM_PERCENT = 3.4;

export function HeroRectangleBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0"
      style={{
        bottom: `${HERO_RECTANGLE_BOTTOM_PERCENT}%`,
        top: `${HERO_RECTANGLE_TOP_PERCENT}%`,
      }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1388 852"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 125.383C0 108.262 13.8792 94.3832 31 94.3832H805C822.121 94.3832 836 80.5041 836 63.3832V31C836 13.8792 849.879 0 867 0H1357C1374.12 0 1388 13.8792 1388 31V821C1388 838.121 1374.12 852 1357 852H31C13.8792 852 0 838.121 0 821V125.383Z"
          fill="url(#hero-rectangle-gradient)"
        />
        <defs>
          <linearGradient
            id="hero-rectangle-gradient"
            x1="198"
            y1="109.873"
            x2="1397.46"
            y2="988.619"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#93B6E3" />
            <stop offset="1" stopColor="#FCF8EC" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
