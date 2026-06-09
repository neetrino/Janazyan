import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Scales a fixed-width row down when the container is narrower than `neededWidth`.
 */
export function useFeaturedRowScale(neededWidth: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || neededWidth <= 0) {
      return;
    }

    const updateScale = () => {
      const available = container.clientWidth;
      setScale(Math.min(1, available / neededWidth));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [neededWidth]);

  return { containerRef, scale };
}
