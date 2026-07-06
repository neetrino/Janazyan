import Link from 'next/link';
import { MIRAGE_PAGE_HEADING_CLASS } from '../../components/home/mirage-heading-styles';
import { STOREFRONT_SKY_PILL_BUTTON_CLASS } from '../products/[slug]/product-action-bar.constants';
import type { StoresTranslation } from '../../features/stores/types';

export function StoresPageHeader({ copy }: { copy: StoresTranslation }) {
  return (
    <section className="py-8 md:py-12">
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
    <section className="border-t border-gray-100 py-14 md:py-16">
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
