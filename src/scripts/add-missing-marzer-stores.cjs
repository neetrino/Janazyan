/**
 * Add partner stores that failed geocoding during Marzer import,
 * using coordinates provided manually.
 *
 * Usage: node src/scripts/add-missing-marzer-stores.cjs
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const ROOT = path.resolve(__dirname, '../..');

/** @typedef {{ name: string, address: string, lat: number, lng: number, regionSlug: string }} StoreRow */

/** @type {StoreRow[]} */
const STORES = [
  {
    name: 'ԱՊԱՐԱՆ ՖԱՐՄ',
    address: 'քաղաք Ապարան, Բաղրամյան 14/44',
    lat: 40.592569,
    lng: 44.355297,
    regionSlug: 'aragatsotn-1',
  },
  {
    name: 'Ա․Բ․Ա',
    address: 'քաղաք Արարատ, Օգոստոսի 23-ի 89/2շ․',
    lat: 39.957464,
    lng: 44.543612,
    regionSlug: 'ararat-2',
  },
  {
    name: 'ՏԱԹԵՎ ՖԱՐՄ',
    address: 'քաղաք Արարատ, Ս․Եղիազարյան 11',
    lat: 39.854618,
    lng: 44.695158,
    regionSlug: 'ararat-2',
  },
  {
    name: 'ՀԱՄ ՖԱՐՄ',
    address: 'քաղաք Արարատ, փ․Աղբյուր Սերոբ 5/5 խանութ',
    lat: 39.851302,
    lng: 44.695594,
    regionSlug: 'ararat-2',
  },
  {
    name: 'ԼԻԼԻ ՖԱՐՄ',
    address: 'քաղաք Արմավիր, Սահմանապահների 48տ․',
    lat: 40.153789,
    lng: 44.045604,
    regionSlug: 'armavir-3',
  },
  {
    name: 'ԼԻԼԻԹ ՖԱՐՄ',
    address: 'Վաղարշապատ, Խորենացի 20/27',
    lat: 40.163771,
    lng: 44.29029,
    regionSlug: 'armavir-3',
  },
  {
    name: 'Ա․Բ․Ա',
    address: 'քաղաք Սևան, Նաիրիան 145/2-1 խանութ',
    lat: 40.54811,
    lng: 44.95537,
    regionSlug: 'gegharkunik-4',
  },
  {
    name: 'ԳԵԴԵՈՆ ՌԻԽՏԵՐ',
    address: 'քաղաք Սևան, Նաիրիան 166',
    lat: 40.548246,
    lng: 44.960367,
    regionSlug: 'gegharkunik-4',
  },
  {
    name: 'ՄԱՐԻԱՄ ԱՆՏՈՆՅԱՆ',
    address: 'քաղաք Սևան, Ս․Սևանցու 2/2',
    lat: 40.54638,
    lng: 44.958723,
    regionSlug: 'gegharkunik-4',
  },
  {
    name: 'ԱՆՈՒՇ ԼԻՆԳԵՐԻ',
    address: 'քաղաք Սևան, Նաիրիան 153/25',
    lat: 40.548261,
    lng: 44.956683,
    regionSlug: 'gegharkunik-4',
  },
  {
    name: 'Ա․Բ․Ա․',
    address: 'քաղաք Վանաձոր, Տիգրան Մեծ 55շ․, 4-րդ խանութ',
    lat: 40.810479,
    lng: 44.488032,
    regionSlug: 'lori-5',
  },
  {
    name: 'ԼՈՒՍԵ ԿՈՍՄԵՏԻԿՍ',
    address: 'քաղաք Վանաձոր, Տիգրան Մեծ 34բ/1',
    lat: 40.809047,
    lng: 44.489311,
    regionSlug: 'lori-5',
  },
  {
    name: 'Ա․Բ․Ա․',
    address: 'քաղաք Հրազդան, 5-րդ միկրոշրջան, 3-րդ փողոց',
    lat: 40.546237,
    lng: 44.771208,
    regionSlug: 'kotayk-6',
  },
  {
    name: 'Ա․Բ․Ա․',
    address: 'քաղաք Չարենցավան, 2-րդ թաղ․, 4-րդ շենք 2խ․',
    lat: 40.404759,
    lng: 44.642333,
    regionSlug: 'kotayk-6',
  },
  {
    name: 'Ա․Բ․Ա․',
    address: 'քաղաք Չարենցավան, 2-րդ թաղ․, 8 շենք 1 խ․',
    lat: 40.4052,
    lng: 44.643,
    regionSlug: 'kotayk-6',
  },
  {
    name: 'ՊԱՐՖՅՈՒՄ ՇՈՓ',
    address: 'քաղաք Աբովյան, Է․Ավագյան փողոց 1/3/1',
    lat: 40.277815,
    lng: 44.637441,
    regionSlug: 'kotayk-6',
  },
  {
    name: 'ԴԵԼՏԱ ՄԵԴ ՖԱԱՐՄ',
    address: 'գյուղ Առինջ, Պ․Սևակ թաղ․, 6-րդ փ․, 2/2',
    lat: 40.222253,
    lng: 44.574543,
    regionSlug: 'kotayk-6',
  },
  {
    name: 'ԹԵՈ ՖԱՐՄԱ',
    address: 'գյուղ Պռոշյան, Հոմպլեքս Հիպեր Մոլ',
    lat: 40.233522,
    lng: 44.442613,
    regionSlug: 'kotayk-6',
  },
  {
    name: 'Ա․Բ․Ա․',
    address: 'քաղաք Կապան, Ստեփանյան փողոց, 16շ․, 36տ․',
    lat: 39.202814,
    lng: 46.401096,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ԿԱՐԴԻՈ ՖԱՐՄ',
    address: 'քաղաք Գորիս, Արցախյան խճուղի 44/4',
    lat: 39.526413,
    lng: 46.326823,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ԿԱՐԴԻՈ ՖԱՐՄ',
    address: 'քաղաք Գորիս, Անկախության 7/11',
    lat: 39.506375,
    lng: 46.342548,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ԷԿՈ ՖԱՐՄ',
    address: 'քաղաք Կապան, Շահումյան 33/22',
    lat: 39.202905,
    lng: 46.413048,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ԿԱՊԱՆ ՖԱՐՄ',
    address: 'քաղաք Կապան, Ռաֆայել Մինասյանի 2',
    lat: 39.210019,
    lng: 46.404846,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ԼԻԼԻ ՖԱՐՄ',
    address: 'քաղաք Կապան, Շահումյան 11/45',
    lat: 39.205425,
    lng: 46.40989,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ABC ՖԱՐՄ',
    address: 'քաղաք Քաջարան, Աբովյան 4/74',
    lat: 39.153093,
    lng: 46.16089,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ABC ՖԱՐՄ',
    address: 'գյուղ Քաջարանց, 3 փողոց, ֆին/տնակ 3, 3309',
    lat: 39.158122,
    lng: 46.126249,
    regionSlug: 'syunik-8',
  },
  {
    name: 'ՄԱՐԳԱՐՅԱՆ Բ/Կ',
    address: 'քաղաք Իջևան, Երևանյան 201/1 1-ին հարկ',
    lat: 40.88211,
    lng: 45.146162,
    regionSlug: 'tavush-10',
  },
];

const SKIPPED_ONLINE = {
  name: 'ԷԼԻԶԱ ԷՋՄԻԱԾԻՆ',
  address: 'օնլայն',
  reason: 'online — no coordinates',
};

function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function toSlug(value) {
  return (
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'item'
  );
}

function localeNames(hyName, enName) {
  return [
    { locale: 'en', name: enName },
    { locale: 'hy', name: hyName },
    { locale: 'ru', name: enName },
  ];
}

function storeTranslations(name, address) {
  return [
    { locale: 'en', name, address, logoAlt: name },
    { locale: 'hy', name, address, logoAlt: name },
    { locale: 'ru', name, address, logoAlt: name },
  ];
}

/**
 * Ensure Armavir region exists between Ararat and Gegharkunik.
 * @param {import('@prisma/client').PrismaClient} prisma
 */
async function ensureArmavirRegion(prisma) {
  const existing = await prisma.partnerStoreRegion.findFirst({
    where: { slug: 'armavir-3', deletedAt: null },
  });
  if (existing) {
    return existing;
  }

  await prisma.partnerStoreRegion.updateMany({
    where: { deletedAt: null, position: { gte: 3 } },
    data: { position: { increment: 1 } },
  });

  return prisma.partnerStoreRegion.create({
    data: {
      slug: 'armavir-3',
      position: 3,
      published: true,
      translations: {
        create: localeNames('Արմավիր', 'Armavir'),
      },
    },
  });
}

/**
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {string} regionId
 * @param {string} address
 * @param {number} lat
 * @param {number} lng
 */
async function findDuplicate(prisma, regionId, address, lat, lng) {
  const byAddress = await prisma.partnerStore.findFirst({
    where: {
      deletedAt: null,
      regionId,
      translations: { some: { locale: 'hy', address } },
    },
  });
  if (byAddress) {
    return byAddress;
  }
  return prisma.partnerStore.findFirst({
    where: {
      deletedAt: null,
      regionId,
      lat,
      lng,
    },
  });
}

async function main() {
  loadEnv();
  const prisma = new PrismaClient();

  let createdStores = 0;
  let skippedDuplicates = 0;
  /** @type {Array<{ name: string, address: string, reason: string }>} */
  const skipped = [SKIPPED_ONLINE];

  try {
    await ensureArmavirRegion(prisma);

    const regions = await prisma.partnerStoreRegion.findMany({
      where: { deletedAt: null },
    });
    const regionBySlug = new Map(regions.map((region) => [region.slug, region]));

    /** @type {Map<string, number>} */
    const nextPositionByRegion = new Map();
    for (const region of regions) {
      const agg = await prisma.partnerStore.aggregate({
        where: { regionId: region.id, deletedAt: null },
        _max: { position: true },
      });
      nextPositionByRegion.set(region.id, (agg._max.position ?? -1) + 1);
    }

    for (let index = 0; index < STORES.length; index += 1) {
      const row = STORES[index];
      const region = regionBySlug.get(row.regionSlug);
      if (!region) {
        skipped.push({
          name: row.name,
          address: row.address,
          reason: `missing region ${row.regionSlug}`,
        });
        continue;
      }

      const duplicate = await findDuplicate(
        prisma,
        region.id,
        row.address,
        row.lat,
        row.lng,
      );
      if (duplicate) {
        skippedDuplicates += 1;
        continue;
      }

      const position = nextPositionByRegion.get(region.id) ?? 0;
      nextPositionByRegion.set(region.id, position + 1);

      const storeSlug = toSlug(`${row.regionSlug}-${row.name}-${index + 1}`);
      await prisma.partnerStore.create({
        data: {
          slug: storeSlug,
          regionId: region.id,
          areaId: null,
          lat: row.lat,
          lng: row.lng,
          position,
          published: true,
          translations: {
            create: storeTranslations(row.name, row.address),
          },
        },
      });
      createdStores += 1;
    }

    console.log(
      JSON.stringify(
        {
          createdStores,
          skippedDuplicates,
          skippedCount: skipped.length,
          skipped,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
