import { Suspense } from 'react';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { loadFaqPageCopy } from '../../features/faq/load-faq-page-copy';
import { fetchPublishedFaq } from '../../lib/faq/faq-cache';
import { getServerLanguage } from '../../lib/language-server';
import { FaqPageMain } from './FaqPageMain';
import { FaqPageFooter, FaqPageHeader } from './FaqPageSections';
import { FaqPageMainSkeleton } from './FaqPageSkeleton';

export const revalidate = 300;

/**
 * FAQ — hero copy paints immediately; accordion sections stream in via Suspense.
 */
export default async function FAQPage() {
  const locale = await getServerLanguage();
  const copy = loadFaqPageCopy(locale);
  const sectionsPromise = fetchPublishedFaq(locale);

  return (
    <ProductsHeroShell
      sectionAriaLabel="FAQ"
      catalog={
        <div className="mx-auto max-w-3xl pb-12 pt-8 md:pt-12">
          <FaqPageHeader copy={copy} />
          <Suspense fallback={<FaqPageMainSkeleton />}>
            <FaqPageMain sectionsPromise={sectionsPromise} locale={locale} />
          </Suspense>
          <FaqPageFooter copy={copy} />
        </div>
      }
    />
  );
}
