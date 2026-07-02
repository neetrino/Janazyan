import type { Metadata } from 'next';
import { getServerLanguage } from '@/lib/language-server';
import { parseProductSlugParam } from '@/lib/products/parse-product-slug';
import { fetchProductPageProduct } from '@/lib/products/product-page-cache';
import { RESERVED_ROUTES } from './types';

const DEFAULT_TITLE = 'Product';
const SITE_NAME = 'Janazyan';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const { slug } = parseProductSlugParam(rawSlug);
  if (!slug || RESERVED_ROUTES.includes(slug.toLowerCase())) {
    return { title: `${DEFAULT_TITLE} | ${SITE_NAME}` };
  }

  const language = await getServerLanguage();
  try {
    const product = await fetchProductPageProduct(slug, language);
    if (!product) {
      return { title: `${DEFAULT_TITLE} | ${SITE_NAME}` };
    }
    const title = product.title || DEFAULT_TITLE;
    const description = product.description || null;
    const firstImage =
      Array.isArray(product.media) && product.media.length > 0
        ? String(
            typeof product.media[0] === 'string'
              ? product.media[0]
              : (product.media[0] as { url?: string }).url ?? product.media[0],
          )
        : null;

    return {
      title: `${title} | ${SITE_NAME}`,
      description: description ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        ...(firstImage && { images: [{ url: firstImage, alt: title }] }),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description ?? undefined,
        ...(firstImage && { images: [firstImage] }),
      },
    };
  } catch {
    return {
      title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    };
  }
}

export default function ProductSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
