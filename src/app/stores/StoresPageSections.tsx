import Link from 'next/link';
import { MIRAGE_PAGE_HEADING_CLASS } from '../../components/home/mirage-heading-styles';
import { STOREFRONT_SKY_PILL_BUTTON_CLASS } from '../products/[slug]/product-action-bar.constants';
import type { StoresTranslation } from '../../features/stores/types';

/** Tighter than the shared page header — less space above the stores title. */
export const STORES_PAGE_HEADER_SECTION_CLASS = 'pb-4 pt-0 md:pb-12 md:pt-2';

/** CTA block: keep space above the heading, almost none under the contact button. */
export const STORES_PAGE_FOOTER_SECTION_CLASS =
  'border-t border-gray-100 pt-14 pb-0 md:pt-16';

/** Shell clearance under the contact button — smaller than the shared catalog footer gap. */
export const STORES_PAGE_CATALOG_BOTTOM_PADDING_CLASS =
  'pb-8 md:pb-10 desktop:pb-12';

export function StoresPageHeader({ copy }: { copy: StoresTranslation }) {
  return (
    <section className={STORES_PAGE_HEADER_SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className={MIRAGE_PAGE_HEADING_CLASS}>
            {copy.title}
          </h1>
          <p className="mt-4 hidden text-base leading-relaxed text-gray-600 md:block md:text-lg">
            {copy.description}
          </p>
        </div>
      </div>
    </section>
  );
}

export function StoresPageFooter({ copy }: { copy: StoresTranslation }) {
  return (
    <section className={STORES_PAGE_FOOTER_SECTION_CLASS}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className={MIRAGE_PAGE_HEADING_CLASS}>
          {copy.cantFind.title}
        </h2>
        <p className="mt-3 text-gray-600">{copy.cantFind.description}</p>
        <Link href="/contact" className={`mt-6 ${STOREFRONT_SKY_PILL_BUTTON_CLASS}`}>
          {copy.cantFind.contactUs}
        </Link>
      </div>
    </section>
  );
}
