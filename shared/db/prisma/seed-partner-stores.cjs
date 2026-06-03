const path = require("path");
const fs = require("fs");

const COORDINATES = {
  "sas-abovyan": { lat: 40.1796, lng: 44.5153 },
  "yerevan-city-komitas": { lat: 40.2068, lng: 44.5186 },
  "grand-hold-arshakunyats": { lat: 40.1598, lng: 44.5032 },
  "medium-amiryan": { lat: 40.1789, lng: 44.5121 },
  "spar-mashtots": { lat: 40.1815, lng: 44.5278 },
  "sas-baghramyan": { lat: 40.1945, lng: 44.4932 },
};

const LOCALES = ["en", "hy", "ru"];

function loadStoresJson(locale) {
  const filePath = path.join(__dirname, "../../../src/locales", locale, "stores.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

/**
 * Seeds partner_stores from locale JSON when table is empty.
 * @param {import('@prisma/client').PrismaClient} prisma
 */
async function seedPartnerStores(prisma) {
  const count = await prisma.partnerStore.count({ where: { deletedAt: null } });
  if (count > 0) {
    console.log("[Seed] Partner stores already exist, skipping");
    return;
  }

  const byLocale = {};
  for (const locale of LOCALES) {
    byLocale[locale] = loadStoresJson(locale);
  }

  const enStores = byLocale.en.partnerStores || [];
  let position = 0;

  for (const enStore of enStores) {
    const coords = COORDINATES[enStore.id];
    if (!coords) {
      console.warn("[Seed] Missing coordinates for", enStore.id);
      continue;
    }

    const translations = LOCALES.map((locale) => {
      const store = (byLocale[locale].partnerStores || []).find((s) => s.id === enStore.id);
      if (!store) {
        return null;
      }
      return {
        locale,
        name: store.name,
        address: store.address,
        logoAlt: store.logoAlt || store.name,
      };
    }).filter(Boolean);

    await prisma.partnerStore.create({
      data: {
        id: enStore.id,
        slug: enStore.id,
        logoUrl: enStore.logo,
        lat: coords.lat,
        lng: coords.lng,
        position,
        published: true,
        translations: { create: translations },
      },
    });

    position += 1;
    console.log("[Seed] Partner store:", enStore.id);
  }

  console.log("[Seed] Partner stores created:", position);
}

module.exports = { seedPartnerStores };
