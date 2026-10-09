import { MIRAGE_PAGE_HEADING_CLASS } from '../../components/home/mirage-heading-styles';
import { BLOG_CARD_SKELETON_CLASS } from '../../features/blog/blog-layout-styles';
import type { BlogPageCopy } from '../../features/blog/load-blog-page-copy';
import { STOREFRONT_PAGE_HEADER_SECTION_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';

const BLOG_SKELETON_CARD_COUNT = 3;

type BlogPageSkeletonProps = {
  copy: BlogPageCopy;
};

/** Header + card placeholders while posts stream in. */
export function BlogPageSkeleton({ copy }: BlogPageSkeletonProps) {
  return (
    <div className={`mx-auto max-w-7xl ${STOREFRONT_PAGE_HEADER_SECTION_CLASS}`}>
      <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <h1 className={MIRAGE_PAGE_HEADING_CLASS}>{copy.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          {copy.description}
        </p>
      </header>
      <div
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: BLOG_SKELETON_CARD_COUNT }).map((_, index) => (
          <div key={index} className={BLOG_CARD_SKELETON_CLASS} aria-hidden />
        ))}
      </div>
    </div>
  );
}
