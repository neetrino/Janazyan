import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Scales a fixed-width row to fit its container: down when the container is
 * narrower than `neededWidth`, and up to `maxScale` when it is wider so the row
 * grows gently on large viewports instead of leaving idle whitespace.
 */
export function useFeaturedRowScale(neededWidth: number, maxScale = 1) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || neededWidth <= 0) {
      return;
    }

    const updateScale = () => {
      const available = container.clientWidth;
      setScale(Math.min(maxScale, available / neededWidth));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [neededWidth, maxScale]);

  return { containerRef, scale };
}
