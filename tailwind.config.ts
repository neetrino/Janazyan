import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/ui/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        ink: {
          900: '#1a1a1f',
          800: '#1e2939',
          700: '#323232',
          600: '#44424a',
          500: '#4a5565',
        },

        cream: '#fcf8ec',
        sky: {
          DEFAULT: '#bcd4ec',
          deep: '#93b6e3',
          soft: '#a3c0e4',
          mist: '#c6ddf3',
        },
        pink: { DEFAULT: '#f5c8ce' },
        butter: { DEFAULT: '#f3e2be' },
        sage: { DEFAULT: '#d6dfc2' },
        lavender: { DEFAULT: '#e7cdff' },
        purple: { DEFAULT: '#b09fc8' },
        coral: { DEFAULT: '#f49395' },
        plum: { DEFAULT: '#b49cc4' },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        body: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        mirage: ['var(--font-mirage)', 'var(--font-wide-display)', 'system-ui', 'sans-serif'],
        wide: ['var(--font-wide-display)', 'serif'],
        armenian: ['var(--font-armenian)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        dmSans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '60px',
        '7xl': '70px',
      },
      backgroundImage: {
        'pastel-arc':
          'linear-gradient(39deg, #93b6e3 8%, #fcf8ec 101%)',
        'products-catalog':
          'linear-gradient(180deg, #c6ddf3 0%, #c6ddf3 28%, #d4e7f8 42%, #e2eff9 56%, #eef5fc 68%, #f7fafd 82%, #ffffff 94%, #ffffff 100%)',
        'products-catalog-mobile':
          'linear-gradient(180deg, #ffffff 0%, #ffffff 6%, #f7fafd 18%, #eef5fc 32%, #e2eff9 44%, #d4e7f8 58%, #c6ddf3 72%, #c6ddf3 100%)',
        'promo-pink':
          'linear-gradient(131deg, #f49395 5%, #b49cc4 82%)',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.08)',
        card: '0 18px 40px -16px rgba(30,41,57,0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
