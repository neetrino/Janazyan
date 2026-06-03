import { FAQ_GLASS_ACCORDION_CLASS } from '../faq-layout-styles';

interface FaqAccordionItemProps {
  question: string;
  answer: string;
}

/** Single FAQ accordion row — native `<details>` for zero client JS. */
export function FaqAccordionItem({ question, answer }: FaqAccordionItemProps) {
  return (
    <details className={FAQ_GLASS_ACCORDION_CLASS}>
      <summary className="faq-accordion-summary flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left">
        <span className="text-base font-semibold leading-snug text-gray-900">{question}</span>
        <span
          className="faq-chevron-icon mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-teal-700"
          aria-hidden
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="border-t border-white/50 px-5 pb-5 pt-3">
        <p className="text-base leading-relaxed text-gray-600">{answer}</p>
      </div>
    </details>
  );
}
