import Link from 'next/link';
import { FAQ_GLASS_CTA_CLASS, FAQ_GLASS_SECTION_CLASS } from '../faq-layout-styles';
import type { FaqPageCopy, FaqSection } from '../types';
import { FaqAccordionItem } from './FaqAccordionItem';

type FaqPageViewProps = {
  sections: FaqSection[];
  copy: FaqPageCopy;
};

/** Public FAQ page — server-rendered for fast first paint. */
export function FaqPageView({ sections, copy }: FaqPageViewProps) {
  return (
    <div className="px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-teal-700">
              FAQ
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {copy.description}
            </p>
          </header>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.id} className={`${FAQ_GLASS_SECTION_CLASS} p-6 sm:p-8`}>
                <h2 className="mb-5 text-xl font-semibold text-gray-900 sm:text-2xl">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.questions.map((faq) => (
                    <FaqAccordionItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section className={FAQ_GLASS_CTA_CLASS}>
              <h2 className="text-xl font-semibold text-gray-900">
                {copy.stillHaveQuestions.title}
              </h2>
              <p className="mt-2 text-gray-600">{copy.stillHaveQuestions.description}</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="font-medium text-teal-700 transition-colors hover:text-teal-800 hover:underline"
                >
                  {copy.stillHaveQuestions.contactUs}
                </Link>
                <Link
                  href="/support"
                  className="font-medium text-teal-700 transition-colors hover:text-teal-800 hover:underline"
                >
                  {copy.stillHaveQuestions.getSupport}
                </Link>
              </div>
            </section>
          </div>
      </div>
    </div>
  );
}
