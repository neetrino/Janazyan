'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { CategoryTreeNode } from '../../lib/categories/category-tree';
import { buildCategoryFilterHrefFromParams } from '../../lib/categories/category-products-href';
import { isCategoryFilterParamActive } from '../../lib/categories/category-filter-param';
import {
  CATEGORY_PILL_DROPDOWN_ITEM_ACTIVE_CLASS,
  CATEGORY_PILL_DROPDOWN_ITEM_CLASS,
  CATEGORY_PILL_DROPDOWN_PANEL_CLASS,
} from './category-pill-dropdown.constants';

const DROPDOWN_GAP_PX = 7;
const DROPDOWN_Z_INDEX = 60;

type DropdownPosition = {
  top: number;
  left: number;
};

type CategoryFilterDropdownContextValue = {
  openCategoryId: string | null;
  toggleCategory: (category: CategoryTreeNode, trigger: HTMLElement) => void;
  closeDropdown: () => void;
  isCategoryOpen: (categoryId: string) => boolean;
};

const CategoryFilterDropdownContext = createContext<CategoryFilterDropdownContextValue | null>(
  null,
);

export function useCategoryFilterDropdown(): CategoryFilterDropdownContextValue {
  const context = useContext(CategoryFilterDropdownContext);
  if (!context) {
    throw new Error('useCategoryFilterDropdown must be used within CategoryFilterDropdownProvider');
  }
  return context;
}

type CategoryFilterDropdownProviderProps = {
  children: ReactNode;
  activeCategorySlug?: string;
};

type PanelLinks = {
  parentHref: string;
  subcategoryHrefById: Map<string, string>;
};

function buildPanelLinks(category: CategoryTreeNode): PanelLinks {
  const searchParams = new URLSearchParams(
    typeof window === 'undefined' ? '' : window.location.search,
  );
  const parentHref = buildCategoryFilterHrefFromParams(category, searchParams);
  const subcategoryHrefById = new Map<string, string>();

  for (const subcategory of category.children) {
    subcategoryHrefById.set(
      subcategory.id,
      buildCategoryFilterHrefFromParams(subcategory, searchParams, {
        allowShopSlugFromTitle: false,
      }),
    );
  }

  return { parentHref, subcategoryHrefById };
}

function CategoryFilterDropdownPanel({
  category,
  position,
  activeCategorySlug,
  parentHref,
  subcategoryHrefById,
}: {
  category: CategoryTreeNode;
  position: DropdownPosition;
  activeCategorySlug?: string;
  parentHref: string;
  subcategoryHrefById: ReadonlyMap<string, string>;
}): ReactElement {
  const isParentActive = isCategoryFilterParamActive(category, activeCategorySlug);

  return (
    <div
      role="listbox"
      data-category-filter-panel={category.id}
      className={`${CATEGORY_PILL_DROPDOWN_PANEL_CLASS} fixed -translate-x-1/2`}
      style={{
        top: position.top,
        left: position.left,
        zIndex: DROPDOWN_Z_INDEX,
      }}
    >
      <ul className="list-disc pl-[21px]">
        <li>
          <Link
            href={parentHref}
            scroll={false}
            role="option"
            aria-selected={isParentActive}
            className={`${CATEGORY_PILL_DROPDOWN_ITEM_CLASS} ${
              isParentActive ? CATEGORY_PILL_DROPDOWN_ITEM_ACTIVE_CLASS : ''
            }`}
          >
            {category.title}
          </Link>
        </li>
        {category.children.map((subcategory) => {
          const isSubActive = isCategoryFilterParamActive(subcategory, activeCategorySlug, {
            allowShopSlugFromTitle: false,
          });

          return (
            <li key={subcategory.id}>
              <Link
                href={subcategoryHrefById.get(subcategory.id) ?? parentHref}
                scroll={false}
                role="option"
                aria-selected={isSubActive}
                className={`${CATEGORY_PILL_DROPDOWN_ITEM_CLASS} ${
                  isSubActive ? CATEGORY_PILL_DROPDOWN_ITEM_ACTIVE_CLASS : ''
                }`}
              >
                {subcategory.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Shared open state + single dropdown portal for duplicated mobile/desktop toolbars. */
export function CategoryFilterDropdownProvider({
  children,
  activeCategorySlug,
}: CategoryFilterDropdownProviderProps): ReactElement {
  const [openCategory, setOpenCategory] = useState<CategoryTreeNode | null>(null);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const [panelLinks, setPanelLinks] = useState<PanelLinks | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const closeDropdown = useCallback(() => {
    setOpenCategory(null);
    setPosition(null);
    setPanelLinks(null);
    triggerRef.current = null;
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + DROPDOWN_GAP_PX,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const toggleCategory = useCallback(
    (category: CategoryTreeNode, trigger: HTMLElement) => {
      if (openCategory?.id === category.id) {
        closeDropdown();
        return;
      }

      triggerRef.current = trigger;
      setOpenCategory(category);
      setPanelLinks(buildPanelLinks(category));
      const rect = trigger.getBoundingClientRect();
      setPosition({
        top: rect.bottom + DROPDOWN_GAP_PX,
        left: rect.left + rect.width / 2,
      });
    },
    [closeDropdown, openCategory?.id],
  );

  const isCategoryOpen = useCallback(
    (categoryId: string) => openCategory?.id === categoryId,
    [openCategory?.id],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    closeDropdown();
  }, [activeCategorySlug, closeDropdown]);

  useEffect(() => {
    if (!openCategory) {
      return;
    }

    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [openCategory, updatePosition]);

  useEffect(() => {
    if (!openCategory) {
      return;
    }

    const handleScroll = () => {
      closeDropdown();
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [closeDropdown, openCategory]);

  useEffect(() => {
    if (!openCategory) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(`[data-category-filter-slug="${openCategory.id}"]`)) {
        return;
      }
      if (target.closest(`[data-category-filter-panel="${openCategory.id}"]`)) {
        return;
      }
      closeDropdown();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeDropdown, openCategory]);

  const contextValue = useMemo(
    () => ({
      openCategoryId: openCategory?.id ?? null,
      toggleCategory,
      closeDropdown,
      isCategoryOpen,
    }),
    [closeDropdown, isCategoryOpen, openCategory?.id, toggleCategory],
  );

  const dropdownPanel =
    openCategory && position && panelLinks ? (
      <CategoryFilterDropdownPanel
        category={openCategory}
        position={position}
        activeCategorySlug={activeCategorySlug}
        parentHref={panelLinks.parentHref}
        subcategoryHrefById={panelLinks.subcategoryHrefById}
      />
    ) : null;

  return (
    <CategoryFilterDropdownContext.Provider value={contextValue}>
      {children}
      {isMounted && dropdownPanel ? createPortal(dropdownPanel, document.body) : null}
    </CategoryFilterDropdownContext.Provider>
  );
}
