'use client';

import Image from 'next/image';
import {
  LOGIN_HERO_LEFT_FRAME_CLASS,
  LOGIN_HERO_LEFT_IMAGE_CLASS,
  LOGIN_HERO_LEFT_IMAGE_SRC,
  LOGIN_HERO_LEFT_WALL_CLASS,
  LOGIN_HERO_LEFT_WIDTH_PX,
  LOGIN_HERO_RIGHT_FLIP_CLASS,
  LOGIN_HERO_RIGHT_HEIGHT_PX,
  LOGIN_HERO_RIGHT_IMAGE_SRC,
  LOGIN_HERO_RIGHT_WIDTH_PX,
  LOGIN_HERO_RIGHT_WRAPPER_CLASS,
} from '../login-page.constants';

/** Login page left hero — Figma node 513:865, same asset as contact. */
export function LoginLeftHeroVisual() {
  return (
    <div className={`relative z-0 ${LOGIN_HERO_LEFT_WALL_CLASS}`}>
      <div className={LOGIN_HERO_LEFT_FRAME_CLASS}>
        <Image
          src={LOGIN_HERO_LEFT_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes={`(max-width: 1299px) 100vw, ${LOGIN_HERO_LEFT_WIDTH_PX}px`}
          className={LOGIN_HERO_LEFT_IMAGE_CLASS}
        />
      </div>
    </div>
  );
}

/** Login page right decoration — Figma node 508:858, vertically mirrored. */
export function LoginRightHeroVisual() {
  return (
    <div className={LOGIN_HERO_RIGHT_WRAPPER_CLASS} aria-hidden>
      <div className={`relative size-full ${LOGIN_HERO_RIGHT_FLIP_CLASS}`}>
        <Image
          src={LOGIN_HERO_RIGHT_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes={`${LOGIN_HERO_RIGHT_WIDTH_PX}px`}
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
