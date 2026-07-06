import Image from 'next/image';
import type { ReactElement } from 'react';
import {
  CATEGORY_PILL_ICON_ACTIVE_CLASS,
} from './category-pill-dropdown.constants';
import { getCategoryPillIcon, resolveCategoryPillIconKey } from './category-pill-icons';

type CategoryPillIconProps = {
  title: string;
  slug: string;
  isActive: boolean;
};

/**
 * Leading icon for a category filter pill — same asset in all states; active only inverts color.
 */
export function CategoryPillIcon({
  title,
  slug,
  isActive,
}: CategoryPillIconProps): ReactElement | null {
  const iconKey = resolveCategoryPillIconKey(slug, title);
  const icon = getCategoryPillIcon(iconKey, isActive);
  const useActiveColorInvert = isActive && iconKey !== 'all';

  if (!icon) {
    return null;
  }

  return (
    <Image
      src={icon.src}
      alt=""
      width={icon.width}
      height={icon.height}
      className={`shrink-0 ${icon.className} ${useActiveColorInvert ? CATEGORY_PILL_ICON_ACTIVE_CLASS : ''}`}
      aria-hidden
    />
  );
}
