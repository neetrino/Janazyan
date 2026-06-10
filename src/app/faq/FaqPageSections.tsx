import Link from 'next/link';
import { FAQ_GLASS_CTA_CLASS } from '../../features/faq/faq-layout-styles';
import type { FaqPageCopy } from '../../features/faq/types';

export function FaqPageHeader({ copy }: { copy: FaqPageCopy }) {
  return (
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
  );
}

export function FaqPageFooter({ copy }: { copy: FaqPageCopy }) {
  return (
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
  );
}
