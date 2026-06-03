import { BLOG_CARD_IMAGE_BOX_CLASS, BLOG_CARD_IMAGE_CLASS } from '../blog-layout-styles';
import { BlogCoverImage } from './BlogCoverImage';

type BlogImageFrameProps = {
  src?: string | null;
  alt: string;
  loading?: 'eager' | 'lazy';
  /** Enables hover zoom when inside a card link group. */
  hoverZoom?: boolean;
};

/** Fixed-size image box — uniform dimensions with center crop. */
export function BlogCardImageFrame({
  src,
  alt,
  loading = 'lazy',
  hoverZoom = false,
}: BlogImageFrameProps) {
  const imageClass = hoverZoom
    ? `${BLOG_CARD_IMAGE_CLASS} group-hover:scale-[1.02]`
    : BLOG_CARD_IMAGE_CLASS;

  return (
    <div className={BLOG_CARD_IMAGE_BOX_CLASS}>
      {src ? (
        <BlogCoverImage src={src} alt={alt} loading={loading} className={imageClass} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
          —
        </div>
      )}
    </div>
  );
}
