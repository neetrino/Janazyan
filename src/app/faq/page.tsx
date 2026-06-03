import { FaqPageView } from '../../features/faq/components/FaqPageView';
import { buildFaqFromLocale } from '../../features/faq/build-faq-from-locale';
import { loadFaqPageCopy } from '../../features/faq/load-faq-page-copy';
import { getCachedPublishedFaq } from '../../lib/faq/faq-cache';
import { getServerLanguage } from '../../lib/language-server';

export const revalidate = 300;

export default async function FAQPage() {
  const locale = await getServerLanguage();
  const sections = await getCachedPublishedFaq(locale);
  const resolvedSections = sections.length > 0 ? sections : buildFaqFromLocale(locale);
  const copy = loadFaqPageCopy(locale);

  return <FaqPageView sections={resolvedSections} copy={copy} />;
}
