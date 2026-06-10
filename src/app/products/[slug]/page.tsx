import { redirect } from 'next/navigation';
import { getServerLanguage } from '@/lib/language-server';
import { parseProductSlugParam } from '@/lib/products/parse-product-slug';
import { fetchProductPageProduct } from '@/lib/products/product-page-cache';
import { ProductPageClient } from './ProductPageClient';
import { RESERVED_ROUTES } from './types';

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ slug?: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug ?? '';
  const { slug, variantIdFromUrl } = parseProductSlugParam(rawSlug);

  if (!slug || RESERVED_ROUTES.includes(slug.toLowerCase())) {
    redirect(`/${slug}`);
  }

  const language = await getServerLanguage();
  const product = await fetchProductPageProduct(slug, language);

  return (
    <ProductPageClient
      slug={slug}
      variantIdFromUrl={variantIdFromUrl}
      language={language}
      initialProduct={product}
      initialNotFound={!product}
    />
  );
}
