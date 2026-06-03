import {
  CAROUSEL_CARD_WIDTH_MOBILE_PX,
  CAROUSEL_CARD_WIDTH_PX,
  CAROUSEL_GLOBE_BACK_OPACITY_MIN,
  CAROUSEL_GLOBE_BACK_SCALE_MIN,
  CAROUSEL_GLOBE_BACK_LIFT_PX,
  CAROUSEL_GLOBE_LATITUDE_DIP_PX,
  CAROUSEL_RADIUS_DESKTOP_PX,
  CAROUSEL_RADIUS_MOBILE_PX,
  CAROUSEL_SCENE_MIN_HEIGHT_PX,
} from './carousel-constants';

const DEG_TO_RAD = Math.PI / 180;

export type CarouselRingLayout = {
  angleStepDeg: number;
  radiusPx: number;
  cardWidthPx: number;
  sceneMinHeightPx: number;
  ringWidthPx: number;
};

function radiusForRing(
  cardWidthPx: number,
  angleStepDeg: number,
  minRadiusPx: number,
): number {
  if (angleStepDeg <= 0) {
    return minRadiusPx;
  }
  const halfStepRad = (angleStepDeg / 2) * DEG_TO_RAD;
  const chordRadius = cardWidthPx / (2 * Math.sin(halfStepRad));
  return Math.max(minRadiusPx, Math.ceil(chordRadius));
}

/** Full 360° ring layout with uniform card size. */
export function getCarouselRingLayout(
  storeCount: number,
  isMobile: boolean,
): CarouselRingLayout {
  const empty: CarouselRingLayout = {
    angleStepDeg: 0,
    radiusPx: 0,
    cardWidthPx: 0,
    sceneMinHeightPx: 0,
    ringWidthPx: 0,
  };

  if (storeCount <= 0) {
    return empty;
  }

  const cardWidthPx = isMobile
    ? CAROUSEL_CARD_WIDTH_MOBILE_PX
    : CAROUSEL_CARD_WIDTH_PX;
  const minRadiusPx = isMobile
    ? CAROUSEL_RADIUS_MOBILE_PX
    : CAROUSEL_RADIUS_DESKTOP_PX;
  const angleStepDeg = storeCount > 0 ? 360 / storeCount : 0;
  const radiusPx =
    storeCount > 1
      ? radiusForRing(cardWidthPx, angleStepDeg, minRadiusPx)
      : minRadiusPx;
  const ringWidthPx = Math.ceil(2 * radiusPx + cardWidthPx);
  const sceneMinHeightPx = Math.max(
    CAROUSEL_SCENE_MIN_HEIGHT_PX,
    Math.ceil(cardWidthPx * 1.55 + radiusPx * 0.2),
  );

  return {
    angleStepDeg,
    radiusPx,
    cardWidthPx,
    sceneMinHeightPx,
    ringWidthPx,
  };
}

/** Position on the ring relative to the active store — cards orbit, faces stay upright. */
export function getCarouselSlotAngleDeg(
  index: number,
  activeIndex: number,
  layout: CarouselRingLayout,
): number {
  return (index - activeIndex) * layout.angleStepDeg;
}

function normalizeCarouselIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }
  return ((index % count) + count) % count;
}

export type CarouselItemGlobePresentation = {
  liftPx: number;
  scale: number;
  opacity: number;
};

/** Depth, latitude dip, and fade for a store slot on the spinning globe. */
export function getCarouselItemGlobePresentation(
  index: number,
  activeIndex: number,
  count: number,
  angleStepDeg: number,
): CarouselItemGlobePresentation {
  const offset = normalizeCarouselIndex(index - activeIndex, count);
  const angleRad = (offset * angleStepDeg * Math.PI) / 180;
  const depthFactor = Math.cos(angleRad);
  const hemisphereFactor = (depthFactor + 1) / 2;
  const sideFactor = Math.abs(Math.sin(angleRad));
  const backFactor = 1 - hemisphereFactor;

  return {
    liftPx: Math.round(
      sideFactor * CAROUSEL_GLOBE_LATITUDE_DIP_PX -
        backFactor * CAROUSEL_GLOBE_BACK_LIFT_PX,
    ),
    scale:
      CAROUSEL_GLOBE_BACK_SCALE_MIN +
      (1 - CAROUSEL_GLOBE_BACK_SCALE_MIN) * hemisphereFactor,
    opacity:
      CAROUSEL_GLOBE_BACK_OPACITY_MIN +
      (1 - CAROUSEL_GLOBE_BACK_OPACITY_MIN) * hemisphereFactor,
  };
}
