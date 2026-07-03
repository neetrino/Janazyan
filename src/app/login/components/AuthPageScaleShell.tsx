'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  AUTH_PAGE_ARTBOARD_HEIGHT_PX,
  AUTH_PAGE_ARTBOARD_WIDTH_PX,
  AUTH_PAGE_SCALE_ARTBOARD_CLASS,
  AUTH_PAGE_SCALE_HOST_CLASS,
  AUTH_PAGE_SCALE_VIEWPORT_CLASS,
} from '../login-page.constants';

type AuthPageScaleShellProps = {
  children: ReactNode;
};

/**
 * Scales the desktop auth layout on tablet/mobile so it matches desktop at a reduced zoom.
 * At {@link AUTH_PAGE_ARTBOARD_WIDTH_PX}+ the wrapper is layout-neutral (no transform).
 */
export function AuthPageScaleShell({ children }: AuthPageScaleShellProps) {
  const scaleExpression = `calc(100cqw / ${AUTH_PAGE_ARTBOARD_WIDTH_PX}px)`;

  return (
    <div
      className={AUTH_PAGE_SCALE_HOST_CLASS}
      style={
        {
          '--auth-artboard-width': AUTH_PAGE_ARTBOARD_WIDTH_PX,
          '--auth-artboard-height': AUTH_PAGE_ARTBOARD_HEIGHT_PX,
          '--auth-scale': scaleExpression,
        } as CSSProperties
      }
    >
      <div className={AUTH_PAGE_SCALE_VIEWPORT_CLASS}>
        <div className={AUTH_PAGE_SCALE_ARTBOARD_CLASS}>{children}</div>
      </div>
    </div>
  );
}
