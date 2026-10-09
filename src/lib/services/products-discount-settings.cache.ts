import { unstable_cache } from 'next/cache';
import { db } from '@white-shop/db';

export type ProductDiscountSettings = {
  globalDiscount: number;
  categoryDiscounts: Record<string, number>;
};

const DISCOUNT_SETTINGS_REVALIDATE_SECONDS = 300;

const EMPTY_DISCOUNTS: ProductDiscountSettings = {
  globalDiscount: 0,
  categoryDiscounts: {},
};

async function loadDiscountSettings(): Promise<ProductDiscountSettings> {
  const discountSettings = await db.settings.findMany({
    where: {
      key: {
        in: ['globalDiscount', 'categoryDiscounts'],
      },
    },
  });

  const globalDiscount =
    Number(
      discountSettings.find((s) => s.key === 'globalDiscount')?.value
    ) || 0;

  const categoryDiscountsSetting = discountSettings.find(
    (s) => s.key === 'categoryDiscounts'
  );
  const categoryDiscounts = categoryDiscountsSetting
    ? (categoryDiscountsSetting.value as Record<string, number>) || {}
    : {};

  return { globalDiscount, categoryDiscounts };
}

export const getCachedProductDiscountSettings = unstable_cache(
  loadDiscountSettings,
  ['product-discount-settings-v2'],
  { revalidate: DISCOUNT_SETTINGS_REVALIDATE_SECONDS }
);

export async function getProductDiscountSettings(): Promise<ProductDiscountSettings> {
  try {
    return await getCachedProductDiscountSettings();
  } catch {
    return EMPTY_DISCOUNTS;
  }
}
