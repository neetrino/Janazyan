/** Shared admin visual tokens — Grill-style cards with Janazyan brand tones. */

export const ADMIN_PAGE_TITLE =
  'text-[26px] leading-tight font-black uppercase sm:text-[30px] sm:leading-[1.2]';

export const ADMIN_CARD_CLASS =
  'rounded-[15px] bg-white ring-1 ring-gray-100/80';

export const ADMIN_CARD_HOVER_CLASS =
  'transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0';

export const ADMIN_CHIP_CORAL = {
  bg: 'bg-coral/10',
  fg: 'text-coral',
} as const;

export const ADMIN_CHIP_BUTTER = {
  bg: 'bg-butter/50',
  fg: 'text-ink-800',
} as const;

export type AnalyticsMetricTone = 'revenue' | 'orders' | 'aov' | 'surface';

export function analyticsMetricToneClass(tone: AnalyticsMetricTone): string {
  switch (tone) {
    case 'revenue':
      return 'bg-coral/10 ring-coral/20';
    case 'orders':
      return 'bg-butter/50 ring-butter/60';
    case 'aov':
      return 'bg-sky/25 ring-sky/35';
    case 'surface':
      return 'bg-cream ring-gray-100';
  }
}

export const ANALYTICS_REVENUE_COLOR = '#f49395';
export const ANALYTICS_ORDERS_COLOR = '#0499c3';

export const DASHBOARD_REVENUE_COLOR = ANALYTICS_REVENUE_COLOR;
export const DASHBOARD_ORDERS_COLOR = ANALYTICS_ORDERS_COLOR;
