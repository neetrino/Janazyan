import Image from 'next/image';
import type { ReactElement } from 'react';
import { getCategoryPillIcon, resolveCategoryPillIconKey } from './category-pill-icons';

type CategoryPillIconProps = {
  title: string;
  slug: string;
  isActive: boolean;
};

/**
 * Leading icon for a category filter pill — Figma assets (node 269:894).
 * Active pills use the grid icon in white; inactive pills use category silhouettes in sky-deep.
 */
export function CategoryPillIcon({
  title,
  slug,
  isActive,
}: CategoryPillIconProps): ReactElement | null {
  const iconKey = resolveCategoryPillIconKey(slug, title);
  const icon = getCategoryPillIcon(iconKey, isActive);

  if (!icon) {
    return null;
  }

  return (
    <Image
      src={icon.src}
      alt=""
      width={24}
      height={24}
      className={`shrink-0 ${icon.className}`}
      aria-hidden
    />
  );
}
