import { db } from "@white-shop/db";
import { logger } from "@/lib/utils/logger";

class AdminSettingsService {
  /**
   * Get settings
   */
  async getSettings() {
    const settings = await db.settings.findMany({
      where: {
        key: {
          in: ['globalDiscount', 'categoryDiscounts', 'brandDiscounts', 'defaultCurrency', 'currencyRates'],
        },
      },
    });
    
    const globalDiscountSetting = settings.find((s) => s.key === 'globalDiscount');
    const categoryDiscountsSetting = settings.find((s) => s.key === 'categoryDiscounts');
    const brandDiscountsSetting = settings.find((s) => s.key === 'brandDiscounts');
    const defaultCurrencySetting = settings.find((s) => s.key === 'defaultCurrency');
    const currencyRatesSetting = settings.find((s) => s.key === 'currencyRates');
    
    // Default currency rates (fallback)
    const defaultCurrencyRates = {
      USD: 1,
      AMD: 400,
      EUR: 0.92,
      RUB: 90,
      GEL: 2.7,
    };
    
    return {
      globalDiscount: globalDiscountSetting ? Number(globalDiscountSetting.value) : 0,
      categoryDiscounts: categoryDiscountsSetting ? (categoryDiscountsSetting.value as Record<string, number>) : {},
      brandDiscounts: brandDiscountsSetting ? (brandDiscountsSetting.value as Record<string, number>) : {},
      defaultCurrency: defaultCurrencySetting ? (defaultCurrencySetting.value as string) : 'AMD',
      currencyRates: currencyRatesSetting ? (currencyRatesSetting.value as Record<string, number>) : defaultCurrencyRates,
    };
  }

  /**
   * Update settings
   */
  async updateSettings(data: any) {
    logger.debug('⚙️ [ADMIN SERVICE] Updating settings...', data);
    
    // Update global discount
    if (data.globalDiscount !== undefined) {
      const globalDiscountValue = Number(data.globalDiscount) || 0;
      await db.settings.upsert({
        where: { key: 'globalDiscount' },
        update: {
          value: globalDiscountValue,
          updatedAt: new Date(),
        },
        create: {
          key: 'globalDiscount',
          value: globalDiscountValue,
          description: 'Global discount percentage for all products',
        },
      });
      logger.debug('✅ [ADMIN SERVICE] Global discount updated:', globalDiscountValue);
    }
    
    // Update category discounts
    if (data.categoryDiscounts !== undefined) {
      await db.settings.upsert({
        where: { key: 'categoryDiscounts' },
        update: {
          value: data.categoryDiscounts,
          updatedAt: new Date(),
        },
        create: {
          key: 'categoryDiscounts',
          value: data.categoryDiscounts,
          description: 'Discount percentages by category ID',
        },
      });
      logger.debug('✅ [ADMIN SERVICE] Category discounts updated:', data.categoryDiscounts);
    }
    
    // Update brand discounts
    if (data.brandDiscounts !== undefined) {
      await db.settings.upsert({
        where: { key: 'brandDiscounts' },
        update: {
          value: data.brandDiscounts,
          updatedAt: new Date(),
        },
        create: {
          key: 'brandDiscounts',
          value: data.brandDiscounts,
          description: 'Discount percentages by brand ID',
        },
      });
      logger.debug('✅ [ADMIN SERVICE] Brand discounts updated:', data.brandDiscounts);
    }
    
    // Update default currency
    if (data.defaultCurrency !== undefined) {
      const currencyValue = String(data.defaultCurrency);
      await db.settings.upsert({
        where: { key: 'defaultCurrency' },
        update: {
          value: currencyValue,
          updatedAt: new Date(),
        },
        create: {
          key: 'defaultCurrency',
          value: currencyValue,
          description: 'Default currency for admin product pricing (USD, AMD, EUR)',
        },
      });
      logger.debug('✅ [ADMIN SERVICE] Default currency updated:', currencyValue);
    }
    
    // Update currency rates
    if (data.currencyRates !== undefined) {
      await db.settings.upsert({
        where: { key: 'currencyRates' },
        update: {
          value: data.currencyRates,
          updatedAt: new Date(),
        },
        create: {
          key: 'currencyRates',
          value: data.currencyRates,
          description: 'Currency exchange rates relative to USD (USD, AMD, EUR, RUB, GEL)',
        },
      });
      logger.debug('✅ [ADMIN SERVICE] Currency rates updated:', data.currencyRates);
    }
    
    return { success: true };
  }
}

export const adminSettingsService = new AdminSettingsService();



