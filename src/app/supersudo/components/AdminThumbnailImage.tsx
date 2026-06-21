'use client';

import { useState } from 'react';

type AdminThumbnailImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Renders a product thumbnail and hides itself when the asset fails to load. */
export function AdminThumbnailImage({ src, alt, className }: AdminThumbnailImageProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        setVisible(false);
      }}
    />
  );
}
