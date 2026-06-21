import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerLanguage } from '@/lib/language-server';
import { parseProductSlugParam } from '@/lib/products/parse-product-slug';
import { ProductPageServer } from './ProductPageServer';
import { ProductPageShell } from './ProductPageShell';
import { RESERVED_ROUTES } from './types';

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ slug?: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [resolvedParams, language] = await Promise.all([params, getServerLanguage()]);
  const rawSlug = resolvedParams?.slug ?? '';
  const { slug, variantIdFromUrl } = parseProductSlugParam(rawSlug);

  if (!slug || RESERVED_ROUTES.includes(slug.toLowerCase())) {
    redirect(`/${slug}`);
  }

  return (
    <Suspense fallback={<ProductPageShell />}>
      <ProductPageServer
        slug={slug}
        variantIdFromUrl={variantIdFromUrl}
        language={language}
      />
    </Suspense>
  );
}
