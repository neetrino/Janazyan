'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  AUTH_PAGE_ARTBOARD_HEIGHT_PX,
  AUTH_PAGE_ARTBOARD_WIDTH_PX,
  AUTH_PAGE_MEASURE_ATTR,
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
 * Viewport height follows in-flow form column height (heroes are absolute and ignored).
 */
export function AuthPageScaleShell({ children }: AuthPageScaleShellProps) {
  const artboardRef = useRef<HTMLDivElement>(null);
  const [artboardHeightPx, setArtboardHeightPx] = useState(AUTH_PAGE_ARTBOARD_HEIGHT_PX);
  const scaleExpression = `calc(100cqw / ${AUTH_PAGE_ARTBOARD_WIDTH_PX}px)`;

  useEffect(() => {
    const artboard = artboardRef.current;
    if (!artboard || typeof ResizeObserver === 'undefined') {
      return;
    }

    const measureTarget =
      artboard.querySelector<HTMLElement>(`[${AUTH_PAGE_MEASURE_ATTR}]`) ?? artboard;

    const updateHeight = () => {
      const nextHeight = measureTarget.offsetHeight;
      if (nextHeight <= 0) {
        return;
      }
      setArtboardHeightPx((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(measureTarget);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={AUTH_PAGE_SCALE_HOST_CLASS}
      style={
        {
          '--auth-artboard-width': AUTH_PAGE_ARTBOARD_WIDTH_PX,
          '--auth-artboard-height': artboardHeightPx,
          '--auth-scale': scaleExpression,
        } as CSSProperties
      }
    >
      <div className={AUTH_PAGE_SCALE_VIEWPORT_CLASS}>
        <div ref={artboardRef} className={AUTH_PAGE_SCALE_ARTBOARD_CLASS}>
          {children}
        </div>
      </div>
    </div>
  );
}
