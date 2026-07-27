import Image from 'next/image';
import type { ReactElement } from 'react';
import { getCategoryPillIcon, resolveCategoryPillIconKey } from './category-pill-icons';

/** Active pill — invert sky-deep SVG assets to white on dark background. */
const CATEGORY_PILL_ICON_ACTIVE_CLASS = 'brightness-0 invert';

/** Inactive pill hover — match active dark surface (requires `group` on the pill). */
const CATEGORY_PILL_ICON_INACTIVE_HOVER_CLASS =
  'group-hover:brightness-0 group-hover:invert';

type CategoryPillIconProps = {
  title: string;
  slug: string;
  isActive: boolean;
};

/**
 * Leading icon for a category filter pill — sky-deep on inactive pills, white on active.
 */
export function CategoryPillIcon({
  title,
  slug,
  isActive,
}: CategoryPillIconProps): ReactElement | null {
  const iconKey = resolveCategoryPillIconKey(slug, title);
  const icon = getCategoryPillIcon(iconKey, isActive);
  const useActiveColorInvert = isActive && iconKey !== 'all';
  const useInactiveHoverInvert = !isActive && iconKey !== 'all';

  if (!icon) {
    return null;
  }

  if (!isActive && iconKey === 'all' && icon.activeSrc) {
    return (
      <>
        <Image
          src={icon.src}
          alt=""
          width={icon.width}
          height={icon.height}
          className={`shrink-0 ${icon.className} group-hover:hidden`}
          aria-hidden
        />
        <Image
          src={icon.activeSrc}
          alt=""
          width={icon.width}
          height={icon.height}
          className={`hidden shrink-0 ${icon.className} group-hover:block`}
          aria-hidden
        />
      </>
    );
  }

  return (
    <Image
      src={icon.src}
      alt=""
      width={icon.width}
      height={icon.height}
      className={`shrink-0 ${icon.className} ${useActiveColorInvert ? CATEGORY_PILL_ICON_ACTIVE_CLASS : ''} ${useInactiveHoverInvert ? CATEGORY_PILL_ICON_INACTIVE_HOVER_CLASS : ''}`}
      aria-hidden
    />
  );
}
