import { unstable_cache } from 'next/cache';
import { db } from '@white-shop/db';

export type ProductDiscountSettings = {
  globalDiscount: number;
  categoryDiscounts: Record<string, number>;
  brandDiscounts: Record<string, number>;
};

const DISCOUNT_SETTINGS_REVALIDATE_SECONDS = 300;

const EMPTY_DISCOUNTS: ProductDiscountSettings = {
  globalDiscount: 0,
  categoryDiscounts: {},
  brandDiscounts: {},
};

async function loadDiscountSettings(): Promise<ProductDiscountSettings> {
  const discountSettings = await db.settings.findMany({
    where: {
      key: {
        in: ['globalDiscount', 'categoryDiscounts', 'brandDiscounts'],
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

  const brandDiscountsSetting = discountSettings.find(
    (s) => s.key === 'brandDiscounts'
  );
  const brandDiscounts = brandDiscountsSetting
    ? (brandDiscountsSetting.value as Record<string, number>) || {}
    : {};

  return { globalDiscount, categoryDiscounts, brandDiscounts };
}

export const getCachedProductDiscountSettings = unstable_cache(
  loadDiscountSettings,
  ['product-discount-settings-v1'],
  { revalidate: DISCOUNT_SETTINGS_REVALIDATE_SECONDS }
);

export async function getProductDiscountSettings(): Promise<ProductDiscountSettings> {
  try {
    return await getCachedProductDiscountSettings();
  } catch {
    return EMPTY_DISCOUNTS;
  }
}
