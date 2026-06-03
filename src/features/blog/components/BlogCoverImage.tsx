type BlogCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

/** Blog cover — native img avoids Next/Image fill height issues on glass cards. */
export function BlogCoverImage({
  src,
  alt,
  className = 'block h-full w-full object-cover',
  loading = 'lazy',
}: BlogCoverImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded URLs; fill layout is unreliable here
    <img src={src} alt={alt} loading={loading} decoding="async" className={className} />
  );
}
