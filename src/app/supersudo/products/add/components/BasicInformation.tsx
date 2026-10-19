'use client';

import { useTranslation } from '../../../../../lib/i18n-client';
import type { LanguageCode } from '../../../../../lib/language';
import type { ProductContentTranslation } from '../../../../../lib/products/product-translations';
import { ProductTranslationFields } from './ProductTranslationFields';

interface BasicInformationProps {
  productType: 'simple' | 'variable';
  setProductType: (type: 'simple' | 'variable') => void;
  syncKey: string;
  slug: string;
  translations: ProductContentTranslation[];
  onTranslationChange: (
    locale: LanguageCode,
    patch: Partial<Pick<ProductContentTranslation, 'title' | 'slug' | 'descriptionHtml'>>,
  ) => void;
}

export function BasicInformation({
  productType,
  setProductType,
  syncKey,
  slug,
  translations,
  onTranslationChange,
}: BasicInformationProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.products.add.basicInformation')}</h2>
      <div className="space-y-4">
        {/* Product Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.products.add.productType')} *
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {t('admin.products.add.productTypeDescription')}
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                value="simple"
                checked={productType === 'simple'}
                onChange={(e) => setProductType(e.target.value as 'simple' | 'variable')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('admin.products.add.productTypeSimple')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                value="variable"
                checked={productType === 'variable'}
                onChange={(e) => setProductType(e.target.value as 'simple' | 'variable')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('admin.products.add.productTypeVariable')}</span>
            </label>
          </div>
        </div>

        <ProductTranslationFields
          syncKey={syncKey}
          slug={slug}
          translations={translations}
          onChange={onTranslationChange}
        />
      </div>
    </div>
  );
}


