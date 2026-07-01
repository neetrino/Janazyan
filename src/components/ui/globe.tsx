'use client';

import type { CSSProperties } from 'react';
import { GLOBE_DEFAULT_SIZE_PX } from './globe.constants';

type GlobeProps = {
  sizePx?: number;
  className?: string;
};

/**
 * Animated rotating earth sphere with twinkling stars.
 * Used as the visual center of the partner stores globe carousel.
 */
export function Globe({
  sizePx = GLOBE_DEFAULT_SIZE_PX,
  className = '',
}: GlobeProps) {
  const rootClassName = ['stores-globe', className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClassName}
      style={{ '--globe-size': `${sizePx}px` } as CSSProperties}
      aria-hidden
    >
      <div className="stores-globe-sphere">
        <span className="stores-globe-star stores-globe-star--1" />
        <span className="stores-globe-star stores-globe-star--2" />
        <span className="stores-globe-star stores-globe-star--3" />
        <span className="stores-globe-star stores-globe-star--4" />
        <span className="stores-globe-star stores-globe-star--5" />
        <span className="stores-globe-star stores-globe-star--6" />
        <span className="stores-globe-star stores-globe-star--7" />
      </div>
    </div>
  );
}
