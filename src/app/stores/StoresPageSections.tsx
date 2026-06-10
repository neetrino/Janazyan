import Link from 'next/link';
import { Button } from '@shop/ui';
import type { StoresTranslation } from '../../features/stores/types';

export function StoresPageHeader({ copy }: { copy: StoresTranslation }) {
  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7CB342] md:text-base">
            {copy.subtitle}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
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
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          {copy.cantFind.title}
        </h2>
        <p className="mt-3 text-gray-600">{copy.cantFind.description}</p>
        <Link href="/contact" className="mt-6 inline-block">
          <Button variant="primary" size="lg">
            {copy.cantFind.contactUs}
          </Button>
        </Link>
      </div>
    </section>
  );
}
