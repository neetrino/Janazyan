'use client';

import Image from 'next/image';
import { MIRAGE_ABOUT_PAGE_HEADING_CLASS } from '../../../components/home/mirage-heading-styles';
import {
  ABOUT_COPY_CLASS,
  ABOUT_CREAM_IMAGE_SRC,
  ABOUT_MOBILE_IMAGE_CLASS,
  ABOUT_MOBILE_SECTION_CLASS,
  ABOUT_SHAMPOO_IMAGE_SRC,
} from '../about-page.constants';

type AboutMobileLayoutProps = {
  title: string;
  intro: string;
  bodyLeft: string[];
  bodyRight: string[];
};

/**
 * Mobile/tablet About stack — same copy and imagery as the Figma desktop composition.
 */
export function AboutMobileLayout({
  title,
  intro,
  bodyLeft,
  bodyRight,
}: AboutMobileLayoutProps) {
  return (
    <section className={ABOUT_MOBILE_SECTION_CLASS}>
      <header className="flex flex-col gap-4">
        <h1 className={MIRAGE_ABOUT_PAGE_HEADING_CLASS}>{title}</h1>
        <p className={ABOUT_COPY_CLASS}>{intro}</p>
      </header>

      <div className={ABOUT_MOBILE_IMAGE_CLASS}>
        <Image
          src={ABOUT_SHAMPOO_IMAGE_SRC}
          alt=""
          width={617}
          height={713}
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      <div className={`space-y-4 ${ABOUT_COPY_CLASS}`}>
        {bodyLeft.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <div className={ABOUT_MOBILE_IMAGE_CLASS}>
        <Image
          src={ABOUT_CREAM_IMAGE_SRC}
          alt=""
          width={651}
          height={649}
          className="h-auto w-full object-contain"
        />
      </div>

      <div className={`space-y-4 ${ABOUT_COPY_CLASS}`}>
        {bodyRight.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
