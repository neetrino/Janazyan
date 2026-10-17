import Image from 'next/image';
import {
  HERO_BODY_WASH_IMAGE_CROP_CLASS,
  HERO_BODY_WASH_IMAGE_HEIGHT_PX,
  HERO_BODY_WASH_IMAGE_WIDTH_PX,
} from './hero-slides';

type HeroBodyWashImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** Figma crop of the body-wash bouquet inside its hero window. */
export function HeroBodyWashImage({ src, alt, priority = false }: HeroBodyWashImageProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={HERO_BODY_WASH_IMAGE_WIDTH_PX}
        height={HERO_BODY_WASH_IMAGE_HEIGHT_PX}
        priority={priority}
        draggable={false}
        sizes="52vw"
        className={HERO_BODY_WASH_IMAGE_CROP_CLASS}
      />
    </div>
  );
}
