'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { buildCatalogPaginationItems } from '@/lib/products/build-catalog-pagination-items';
import { buildCatalogPaginationUrl } from '@/lib/products/build-catalog-pagination-url';
import type { SearchParamsInput } from '@/lib/products/catalog-search-params';
import {
  PRODUCTS_CATALOG_PAGINATION_CONTROL_CLASS,
  PRODUCTS_CATALOG_PAGINATION_CONTROL_DISABLED_CLASS,
  PRODUCTS_CATALOG_PAGINATION_ELLIPSIS_CLASS,
  PRODUCTS_CATALOG_PAGINATION_FIRST_ICON_SRC,
  PRODUCTS_CATALOG_PAGINATION_ICON_SIZE_PX,
  PRODUCTS_CATALOG_PAGINATION_LAST_ICON_SRC,
  PRODUCTS_CATALOG_PAGINATION_NAV_CLASS,
  PRODUCTS_CATALOG_PAGINATION_NEXT_ICON_SRC,
  PRODUCTS_CATALOG_PAGINATION_PAGE_ACTIVE_CLASS,
  PRODUCTS_CATALOG_PAGINATION_PAGE_BASE_CLASS,
  PRODUCTS_CATALOG_PAGINATION_PAGE_INACTIVE_CLASS,
  PRODUCTS_CATALOG_PAGINATION_PREV_ICON_SRC,
} from './products-catalog-pagination.constants';

type ProductsCatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  raw: SearchParamsInput;
};

type PaginationControlProps = {
  href: string;
  iconSrc: string;
  label: string;
  disabled?: boolean;
};

function PaginationControl({
  href,
  iconSrc,
  label,
  disabled = false,
}: PaginationControlProps) {
  const className = disabled
    ? `${PRODUCTS_CATALOG_PAGINATION_CONTROL_CLASS} ${PRODUCTS_CATALOG_PAGINATION_CONTROL_DISABLED_CLASS}`
    : PRODUCTS_CATALOG_PAGINATION_CONTROL_CLASS;

  if (disabled) {
    return (
      <span className={className} aria-hidden="true">
        <Image
          src={iconSrc}
          alt=""
          width={PRODUCTS_CATALOG_PAGINATION_ICON_SIZE_PX}
          height={PRODUCTS_CATALOG_PAGINATION_ICON_SIZE_PX}
          aria-hidden
        />
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-label={label}>
      <Image
        src={iconSrc}
        alt=""
        width={PRODUCTS_CATALOG_PAGINATION_ICON_SIZE_PX}
        height={PRODUCTS_CATALOG_PAGINATION_ICON_SIZE_PX}
        aria-hidden
      />
    </Link>
  );
}

export function ProductsCatalogPagination({
  currentPage,
  totalPages,
  raw,
}: ProductsCatalogPaginationProps) {
  const items = useMemo(
    () => buildCatalogPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={PRODUCTS_CATALOG_PAGINATION_NAV_CLASS} aria-label="Pagination">
      <PaginationControl
        href={buildCatalogPaginationUrl(1, raw)}
        iconSrc={PRODUCTS_CATALOG_PAGINATION_FIRST_ICON_SRC}
        label="First page"
        disabled={currentPage === 1}
      />
      <PaginationControl
        href={buildCatalogPaginationUrl(currentPage - 1, raw)}
        iconSrc={PRODUCTS_CATALOG_PAGINATION_PREV_ICON_SRC}
        label="Previous page"
        disabled={currentPage === 1}
      />

      {items.map((item, index) => {
        if (item.type === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className={PRODUCTS_CATALOG_PAGINATION_ELLIPSIS_CLASS}
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const isActive = item.page === currentPage;

        if (isActive) {
          return (
            <span
              key={item.page}
              className={`${PRODUCTS_CATALOG_PAGINATION_PAGE_BASE_CLASS} ${PRODUCTS_CATALOG_PAGINATION_PAGE_ACTIVE_CLASS}`}
              aria-current="page"
            >
              {item.page}
            </span>
          );
        }

        return (
          <Link
            key={item.page}
            href={buildCatalogPaginationUrl(item.page, raw)}
            className={`${PRODUCTS_CATALOG_PAGINATION_PAGE_BASE_CLASS} ${PRODUCTS_CATALOG_PAGINATION_PAGE_INACTIVE_CLASS}`}
            aria-label={`Page ${item.page}`}
          >
            {item.page}
          </Link>
        );
      })}

      <PaginationControl
        href={buildCatalogPaginationUrl(currentPage + 1, raw)}
        iconSrc={PRODUCTS_CATALOG_PAGINATION_NEXT_ICON_SRC}
        label="Next page"
        disabled={currentPage === totalPages}
      />
      <PaginationControl
        href={buildCatalogPaginationUrl(totalPages, raw)}
        iconSrc={PRODUCTS_CATALOG_PAGINATION_LAST_ICON_SRC}
        label="Last page"
        disabled={currentPage === totalPages}
      />
    </nav>
  );
}
