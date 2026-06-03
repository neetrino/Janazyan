import {
  CAROUSEL_CARD_WIDTH_MOBILE_PX,
  CAROUSEL_CARD_WIDTH_PX,
  CAROUSEL_FRONT_FACE_Z_OFFSET_MOBILE_PX,
  CAROUSEL_FRONT_FACE_Z_OFFSET_PX,
  CAROUSEL_GLOBE_BACK_LIFT_MOBILE_PX,
  CAROUSEL_GLOBE_BACK_OPACITY_MIN,
  CAROUSEL_GLOBE_BACK_OPACITY_MIN_MOBILE,
  CAROUSEL_GLOBE_BACK_SCALE_MIN,
  CAROUSEL_GLOBE_BACK_SCALE_MIN_MOBILE,
  CAROUSEL_GLOBE_BACK_LIFT_PX,
  CAROUSEL_GLOBE_LATITUDE_DIP_MOBILE_PX,
  CAROUSEL_GLOBE_LATITUDE_DIP_PX,
  CAROUSEL_GLOBE_TILT_DEG,
  CAROUSEL_GLOBE_TILT_MOBILE_DEG,
  CAROUSEL_PERSPECTIVE_MOBILE_PX,
  CAROUSEL_PERSPECTIVE_PX,
  CAROUSEL_RADIUS_DESKTOP_PX,
  CAROUSEL_RADIUS_MOBILE_MAX_PX,
  CAROUSEL_RADIUS_MOBILE_PX,
  CAROUSEL_SCENE_MIN_HEIGHT_MOBILE_PX,
  CAROUSEL_SCENE_MIN_HEIGHT_PX,
  CAROUSEL_SCENE_SHIFT_UP_MOBILE_PX,
  CAROUSEL_SCENE_SHIFT_UP_PX,
} from './carousel-constants';

const DEG_TO_RAD = Math.PI / 180;

export type CarouselRingLayout = {
  angleStepDeg: number;
  radiusPx: number;
  cardWidthPx: number;
  sceneMinHeightPx: number;
  ringWidthPx: number;
  perspectivePx: number;
  sceneShiftUpPx: number;
  frontFaceZOffsetPx: number;
  globeTiltDeg: number;
  globeLatitudeDipPx: number;
  globeBackLiftPx: number;
  globeBackScaleMin: number;
  globeBackOpacityMin: number;
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
    perspectivePx: 0,
    sceneShiftUpPx: 0,
    frontFaceZOffsetPx: 0,
    globeTiltDeg: 0,
    globeLatitudeDipPx: 0,
    globeBackLiftPx: 0,
    globeBackScaleMin: 1,
    globeBackOpacityMin: 1,
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
  const computedRadiusPx =
    storeCount > 1
      ? radiusForRing(cardWidthPx, angleStepDeg, minRadiusPx)
      : minRadiusPx;
  const radiusPx = isMobile
    ? Math.min(computedRadiusPx, CAROUSEL_RADIUS_MOBILE_MAX_PX)
    : computedRadiusPx;
  const ringWidthPx = Math.ceil(2 * radiusPx + cardWidthPx);
  const sceneMinHeightBase = isMobile
    ? CAROUSEL_SCENE_MIN_HEIGHT_MOBILE_PX
    : CAROUSEL_SCENE_MIN_HEIGHT_PX;
  const sceneMinHeightPx = Math.max(
    sceneMinHeightBase,
    Math.ceil(
      cardWidthPx * (isMobile ? 1.15 : 1.55) + radiusPx * (isMobile ? 0.08 : 0.2),
    ),
  );

  return {
    angleStepDeg,
    radiusPx,
    cardWidthPx,
    sceneMinHeightPx,
    ringWidthPx,
    perspectivePx: isMobile ? CAROUSEL_PERSPECTIVE_MOBILE_PX : CAROUSEL_PERSPECTIVE_PX,
    sceneShiftUpPx: isMobile
      ? CAROUSEL_SCENE_SHIFT_UP_MOBILE_PX
      : CAROUSEL_SCENE_SHIFT_UP_PX,
    frontFaceZOffsetPx: isMobile
      ? CAROUSEL_FRONT_FACE_Z_OFFSET_MOBILE_PX
      : CAROUSEL_FRONT_FACE_Z_OFFSET_PX,
    globeTiltDeg: isMobile ? CAROUSEL_GLOBE_TILT_MOBILE_DEG : CAROUSEL_GLOBE_TILT_DEG,
    globeLatitudeDipPx: isMobile
      ? CAROUSEL_GLOBE_LATITUDE_DIP_MOBILE_PX
      : CAROUSEL_GLOBE_LATITUDE_DIP_PX,
    globeBackLiftPx: isMobile
      ? CAROUSEL_GLOBE_BACK_LIFT_MOBILE_PX
      : CAROUSEL_GLOBE_BACK_LIFT_PX,
    globeBackScaleMin: isMobile
      ? CAROUSEL_GLOBE_BACK_SCALE_MIN_MOBILE
      : CAROUSEL_GLOBE_BACK_SCALE_MIN,
    globeBackOpacityMin: isMobile
      ? CAROUSEL_GLOBE_BACK_OPACITY_MIN_MOBILE
      : CAROUSEL_GLOBE_BACK_OPACITY_MIN,
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
  layout: Pick<
    CarouselRingLayout,
    | 'globeLatitudeDipPx'
    | 'globeBackLiftPx'
    | 'globeBackScaleMin'
    | 'globeBackOpacityMin'
  >,
): CarouselItemGlobePresentation {
  const offset = normalizeCarouselIndex(index - activeIndex, count);
  const angleRad = (offset * angleStepDeg * Math.PI) / 180;
  const depthFactor = Math.cos(angleRad);
  const hemisphereFactor = (depthFactor + 1) / 2;
  const sideFactor = Math.abs(Math.sin(angleRad));
  const backFactor = 1 - hemisphereFactor;

  return {
    liftPx: Math.round(
      sideFactor * layout.globeLatitudeDipPx - backFactor * layout.globeBackLiftPx,
    ),
    scale:
      layout.globeBackScaleMin +
      (1 - layout.globeBackScaleMin) * hemisphereFactor,
    opacity:
      layout.globeBackOpacityMin +
      (1 - layout.globeBackOpacityMin) * hemisphereFactor,
  };
}
