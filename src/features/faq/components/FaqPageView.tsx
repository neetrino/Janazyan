import { FAQ_GLASS_SECTION_CLASS } from '../faq-layout-styles';
import type { FaqSection } from '../types';
import { FaqAccordionItem } from './FaqAccordionItem';

type FaqSectionsContentProps = {
  sections: FaqSection[];
};

/** Published FAQ accordion sections — server-rendered, zero client JS. */
export function FaqSectionsContent({ sections }: FaqSectionsContentProps) {
  return (
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
    </div>
  );
}
