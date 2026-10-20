import Image from 'next/image';
import { HERO_BODY_WASH_IMAGE_CLASS } from './hero-slides';

type HeroBodyWashImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** Shampoo photo in the Figma frame — right edge of the file on the frame’s right edge. */
export function HeroBodyWashImage({ src, alt, priority = false }: HeroBodyWashImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      draggable={false}
      sizes="(min-width: 1440px) 617px, 43vw"
      className={HERO_BODY_WASH_IMAGE_CLASS}
    />
  );
}
