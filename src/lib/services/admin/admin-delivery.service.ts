import { db } from "@white-shop/db";
import { calculateZoneDeliveryPrice } from "@/lib/delivery/calculate-delivery-price";
import { DELIVERY_SETTINGS_DB_KEY } from "@/lib/delivery/delivery-settings.constants";
import { DEFAULT_DELIVERY_SETTINGS } from "@/lib/delivery/delivery-settings.defaults";
import {
  normalizeDeliverySettings,
  toPublicDeliverySettings,
} from "@/lib/delivery/normalize-delivery-settings";
import {
  findDeliveryCountry,
  findDeliveryZone,
} from "@/lib/delivery/find-delivery-zone";
import type { DeliverySettings } from "@/lib/delivery/delivery-settings.types";

class AdminDeliveryService {
  private async readSettings(): Promise<DeliverySettings> {
    const setting = await db.settings.findUnique({
      where: { key: DELIVERY_SETTINGS_DB_KEY },
    });

    if (!setting) {
      return DEFAULT_DELIVERY_SETTINGS;
    }

    return normalizeDeliverySettings(setting.value);
  }

  async getDeliverySettings(): Promise<DeliverySettings> {
    return this.readSettings();
  }

  async getDeliveryOptions() {
    const settings = await this.readSettings();
    return toPublicDeliverySettings(settings);
  }

  async getDeliveryPrice(
    zoneSlugOrName: string,
    country: string = 'Armenia',
    orderSubtotalAmd = 0,
  ): Promise<number> {
    const settings = await this.readSettings();
    const deliveryCountry = findDeliveryCountry(settings, country);

    if (!deliveryCountry) {
      return 0;
    }

    const zone = findDeliveryZone(deliveryCountry, zoneSlugOrName);
    if (!zone) {
      return 0;
    }

    return calculateZoneDeliveryPrice(zone, orderSubtotalAmd);
  }

  async updateDeliverySettings(data: DeliverySettings) {
    const normalized = normalizeDeliverySettings(data);

    if (!Array.isArray(normalized.countries)) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation Error",
        detail: "Countries must be an array",
      };
    }

    if (normalized.countries.length === 0) {
      await db.settings.upsert({
        where: { key: DELIVERY_SETTINGS_DB_KEY },
        update: {
          value: normalized,
          updatedAt: new Date(),
        },
        create: {
          key: DELIVERY_SETTINGS_DB_KEY,
          value: normalized,
          description: 'Delivery countries, zones, pricing rules and extra fields',
        },
      });

      return normalized;
    }

    for (const country of normalized.countries) {
      if (!country.name.trim()) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/validation-error",
          title: "Validation Error",
          detail: "Each country must have a name",
        };
      }

      if (!country.zones.length) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/validation-error",
          title: "Validation Error",
          detail: `Country "${country.name}" must have at least one zone`,
        };
      }

      for (const zone of country.zones) {
        if (!zone.name.trim()) {
          throw {
            status: 400,
            type: "https://api.shop.am/problems/validation-error",
            title: "Validation Error",
            detail: `Each zone in "${country.name}" must have a name`,
          };
        }
      }
    }

    await db.settings.upsert({
      where: { key: DELIVERY_SETTINGS_DB_KEY },
      update: {
        value: normalized,
        updatedAt: new Date(),
      },
      create: {
        key: DELIVERY_SETTINGS_DB_KEY,
        value: normalized,
        description: 'Delivery countries, zones, pricing rules and extra fields',
      },
    });

    return normalized;
  }
}

export const adminDeliveryService = new AdminDeliveryService();
