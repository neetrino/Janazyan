'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ProductImagePlaceholder } from '../ProductImagePlaceholder';

type FeaturedProductCardImageProps = {
  src: string | null;
  alt: string;
  priority?: boolean;
};

export function FeaturedProductCardImage({
  src,
  alt,
  priority = true,
}: FeaturedProductCardImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <ProductImagePlaceholder
        className="h-full w-full rounded-[12px] bg-transparent"
        aria-label={alt ? `No image for ${alt}` : 'No image'}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="96px"
      className="object-contain object-bottom"
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
