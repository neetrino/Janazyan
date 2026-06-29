'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HOME_FEATURED_PRODUCT_FALLBACK_IMAGE } from '../../lib/home/map-to-home-featured-product';

type FeaturedProductCardImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function FeaturedProductCardImage({
  src,
  alt,
  priority = true,
}: FeaturedProductCardImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="112px"
      className="object-contain object-bottom"
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => {
        if (imageSrc !== HOME_FEATURED_PRODUCT_FALLBACK_IMAGE) {
          setImageSrc(HOME_FEATURED_PRODUCT_FALLBACK_IMAGE);
        }
      }}
    />
  );
}
