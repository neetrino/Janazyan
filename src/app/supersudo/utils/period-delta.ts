/** Percentage change label vs previous period (Grill admin dashboard pattern). */

export function formatPeriodDelta(current: number, previous: number): string {
  if (previous === 0) {
    if (current === 0) {
      return '0%';
    }
    return '+100%';
  }

  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

export function periodDeltaToneClass(delta: string): string {
  if (delta.startsWith('+') && delta !== '+0.0%' && delta !== '+0%') {
    return 'text-success';
  }
  if (delta.startsWith('-')) {
    return 'text-coral';
  }
  return 'text-gray-500';
}
