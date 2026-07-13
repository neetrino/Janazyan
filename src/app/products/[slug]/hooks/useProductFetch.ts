import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../../lib/api-client';
import { getStoredLanguage, DEFAULT_LANGUAGE } from '../../../../lib/language';
import { logger } from '@/lib/utils/logger';
import { RESERVED_ROUTES } from '../types';
import type { Product } from '../types';

interface UseProductFetchProps {
  slug: string;
  variantIdFromUrl: string | null;
  initialProduct?: Product | null;
  initialNotFound?: boolean;
}

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'status' in error &&
      Number((error as { status: number }).status) === 404,
  );
}

async function fetchProductForLang(slug: string, lang: string): Promise<Product> {
  return apiClient.get<Product>(`/api/v1/products/${slug}/details`, {
    params: { lang },
  });
}

export function useProductFetch({
  slug,
  variantIdFromUrl,
  initialProduct = null,
  initialNotFound = false,
}: UseProductFetchProps) {
  const router = useRouter();
  const hasServerPayload = initialProduct !== null || initialNotFound;
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [loading, setLoading] = useState(!hasServerPayload);
  const [notFound, setNotFound] = useState(initialNotFound);
  const generationRef = useRef(0);

  useEffect(() => {
    setProduct(initialProduct);
    setNotFound(initialNotFound);
    setLoading(!hasServerPayload);
  }, [initialProduct, initialNotFound, hasServerPayload]);

  const runLoad = useCallback(async () => {
    if (!slug || RESERVED_ROUTES.includes(slug.toLowerCase())) {
      setLoading(false);
      return;
    }
    const gen = ++generationRef.current;
    setLoading(true);
    setNotFound(false);

    const currentLang = getStoredLanguage();

    const load = async (lang: string) => {
      try {
        return await fetchProductForLang(slug, lang);
      } catch (second: unknown) {
        if (isNotFoundError(second) && lang !== DEFAULT_LANGUAGE) {
          return fetchProductForLang(slug, DEFAULT_LANGUAGE);
        }
        throw second;
      }
    };

    try {
      const data = await load(currentLang);
      if (gen !== generationRef.current) return;
      setProduct(data);
    } catch (error: unknown) {
      logger.warn('Product fetch failed', {
        slug,
        error: error instanceof Error ? error.message : String(error),
      });
      try {
        const fallback = await apiClient.get<Product>(`/api/v1/products/${slug}`, {
          params: { lang: currentLang },
        });
        if (gen !== generationRef.current) return;
        setProduct(fallback);
      } catch (inner: unknown) {
        if (gen !== generationRef.current) return;
        setProduct(null);
        setNotFound(isNotFoundError(inner));
      }
    } finally {
      if (gen === generationRef.current) {
        setLoading(false);
      }
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    if (RESERVED_ROUTES.includes(slug.toLowerCase())) {
      router.replace(`/${slug}`);
    }
  }, [slug, router]);

  useEffect(() => {
    if (!slug || RESERVED_ROUTES.includes(slug.toLowerCase())) return;
    if (hasServerPayload) return;
    void runLoad();
  }, [slug, variantIdFromUrl, hasServerPayload, runLoad]);

  useEffect(() => {
    if (!slug || RESERVED_ROUTES.includes(slug.toLowerCase())) return;

    const handleLanguageUpdate = () => {
      void runLoad();
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, [slug, runLoad]);

  return {
    product,
    loading,
    notFound,
  };
}
