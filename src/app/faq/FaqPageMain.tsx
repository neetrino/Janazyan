import type { LanguageCode } from '../../lib/language';
import { buildFaqFromLocale } from '../../features/faq/build-faq-from-locale';
import { FaqSectionsContent } from '../../features/faq/components/FaqPageView';
import type { FaqSection } from '../../features/faq/types';

type FaqPageMainProps = {
  sectionsPromise: Promise<FaqSection[]>;
  locale: LanguageCode;
};

export async function FaqPageMain({ sectionsPromise, locale }: FaqPageMainProps) {
  const dbSections = await sectionsPromise;
  const sections =
    dbSections.length > 0 ? dbSections : buildFaqFromLocale(locale);

  return <FaqSectionsContent sections={sections} />;
}
