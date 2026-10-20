'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { MIRAGE_ABOUT_PAGE_HEADING_CLASS } from '../../../components/home/mirage-heading-styles';
import {
  ABOUT_ARTBOARD_FOOTER_GAP_PX,
  ABOUT_ARTBOARD_HEIGHT_PX,
  ABOUT_ARTBOARD_WIDTH_PX,
  ABOUT_BODY_LEFT_LEFT_PX,
  ABOUT_BODY_LEFT_TOP_PX,
  ABOUT_BODY_LEFT_WIDTH_PX,
  ABOUT_BODY_RIGHT_LEFT_PX,
  ABOUT_BODY_RIGHT_TOP_PX,
  ABOUT_BODY_RIGHT_WIDTH_PX,
  ABOUT_COPY_CLASS,
  ABOUT_CREAM_HEIGHT_PX,
  ABOUT_CREAM_IMAGE_SRC,
  ABOUT_CREAM_LEFT_PX,
  ABOUT_CREAM_TOP_PX,
  ABOUT_CREAM_WIDTH_PX,
  ABOUT_HEADING_LEFT_PX,
  ABOUT_HEADING_TOP_PX,
  ABOUT_HEADING_WIDTH_PX,
  ABOUT_SHAMPOO_IMAGE_HEIGHT_PX,
  ABOUT_SHAMPOO_IMAGE_SRC,
  ABOUT_SHAMPOO_IMAGE_WIDTH_PX,
  ABOUT_SHAMPOO_RIGHT_INSET_PX,
  ABOUT_SHAMPOO_TOP_PX,
  ABOUT_SHAMPOO_WIDTH_PX,
} from '../about-page.constants';

type AboutDesktopLayoutProps = {
  title: string;
  intro: string;
  bodyLeft: string[];
  bodyRight: string[];
};

/**
 * Desktop About layout — Figma node 598:549 absolute artboard (1:1 at 1440).
 */
export function AboutDesktopLayout({
  title,
  intro,
  bodyLeft,
  bodyRight,
}: AboutDesktopLayoutProps) {
  const scaleExpression = `min(1, calc(100cqw / ${ABOUT_ARTBOARD_WIDTH_PX}px))`;
  const artboardTotalHeightPx = ABOUT_ARTBOARD_HEIGHT_PX + ABOUT_ARTBOARD_FOOTER_GAP_PX;

  return (
    <div className="about-page-scale-host relative w-full">
      <div className="relative mx-auto w-full" style={{ maxWidth: ABOUT_ARTBOARD_WIDTH_PX }}>
      <div
        className="pointer-events-none absolute z-[1] origin-top-right"
        style={{
          right: ABOUT_SHAMPOO_RIGHT_INSET_PX,
          top: ABOUT_SHAMPOO_TOP_PX,
          width: ABOUT_SHAMPOO_WIDTH_PX,
          transform: `scale(${scaleExpression})`,
        }}
      >
        <Image
          src={ABOUT_SHAMPOO_IMAGE_SRC}
          alt=""
          width={ABOUT_SHAMPOO_IMAGE_WIDTH_PX}
          height={ABOUT_SHAMPOO_IMAGE_HEIGHT_PX}
          sizes={`${ABOUT_SHAMPOO_WIDTH_PX}px`}
          className="h-auto w-full"
          priority
        />
      </div>
      <div
        className="relative w-full"
        style={{
          height: `calc(${artboardTotalHeightPx}px * ${scaleExpression})`,
        }}
      >
        <div
          className="relative origin-top-left"
          style={
            {
              width: ABOUT_ARTBOARD_WIDTH_PX,
              height: artboardTotalHeightPx,
              transform: `scale(${scaleExpression})`,
            } as CSSProperties
          }
        >
          <div
            className="pointer-events-none absolute z-[1]"
            style={{
              left: ABOUT_CREAM_LEFT_PX,
              top: ABOUT_CREAM_TOP_PX,
              width: ABOUT_CREAM_WIDTH_PX,
              height: ABOUT_CREAM_HEIGHT_PX,
            }}
          >
            <Image
              src={ABOUT_CREAM_IMAGE_SRC}
              alt=""
              fill
              sizes={`${ABOUT_CREAM_WIDTH_PX}px`}
              className="object-cover"
            />
          </div>

          <header
            className="absolute z-[2] flex flex-col gap-9 px-2"
            style={{
              left: ABOUT_HEADING_LEFT_PX,
              top: ABOUT_HEADING_TOP_PX,
              width: ABOUT_HEADING_WIDTH_PX,
            }}
          >
            <h1 className={MIRAGE_ABOUT_PAGE_HEADING_CLASS}>{title}</h1>
            <p className={`${ABOUT_COPY_CLASS} max-w-[731px]`}>{intro}</p>
          </header>

          <div
            className={`absolute z-[2] ${ABOUT_COPY_CLASS}`}
            style={{
              left: ABOUT_BODY_LEFT_LEFT_PX,
              top: ABOUT_BODY_LEFT_TOP_PX,
              width: ABOUT_BODY_LEFT_WIDTH_PX,
            }}
          >
            {bodyLeft.map((paragraph, index) => (
              <p key={paragraph.slice(0, 24)} className={index > 0 ? 'mt-6' : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          <div
            className={`absolute z-[2] text-right ${ABOUT_COPY_CLASS}`}
            style={{
              left: ABOUT_BODY_RIGHT_LEFT_PX,
              top: ABOUT_BODY_RIGHT_TOP_PX,
              width: ABOUT_BODY_RIGHT_WIDTH_PX,
            }}
          >
            {bodyRight.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={index === 1 ? 'mt-6' : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
