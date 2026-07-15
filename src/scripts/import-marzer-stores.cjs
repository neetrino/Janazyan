/**
 * Import: Marzer.xlsx → 2-level hierarchy
 * Region (sheet / marz) → Store (no areas)
 * Only imports rows that geocode successfully.
 *
 * Usage: node src/scripts/import-marzer-stores.cjs
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const ROOT = path.resolve(__dirname, '../..');
const XLSX_PATH = path.join(ROOT, 'Marzer.xlsx');

const REGION_EN = {
  Արագածոտն: 'Aragatsotn',
  Արարատ: 'Ararat',
  Արմավիր: 'Armavir',
  Գեղարքունիք: 'Gegharkunik',
  Լոռի: 'Lori',
  Կոտայք: 'Kotayk',
  Շիրակ: 'Shirak',
  Սյունիք: 'Syunik',
  'Վայոց Ձոր': 'Vayots Dzor',
  Տավուշ: 'Tavush',
};

const REGION_ANCHORS = {
  Aragatsotn: { lat: 40.35, lng: 44.3, maxKm: 55 },
  Ararat: { lat: 39.95, lng: 44.55, maxKm: 55 },
  Armavir: { lat: 40.15, lng: 44.03, maxKm: 50 },
  Gegharkunik: { lat: 40.35, lng: 45.35, maxKm: 80 },
  Kotayk: { lat: 40.35, lng: 44.65, maxKm: 45 },
  Lori: { lat: 40.95, lng: 44.45, maxKm: 70 },
  Shirak: { lat: 40.78, lng: 43.85, maxKm: 55 },
  Syunik: { lat: 39.3, lng: 46.25, maxKm: 90 },
  Tavush: { lat: 40.95, lng: 45.2, maxKm: 60 },
  'Vayots Dzor': { lat: 39.75, lng: 45.35, maxKm: 55 },
};

const CITY_EN = {
  Աշտարակ: 'Ashtarak',
  Ապարան: 'Aparan',
  Արարատ: 'Ararat',
  Արմավիր: 'Armavir',
  Վաղարշապատ: 'Vagharshapat',
  Էջմիածին: 'Ejmiatsin',
  Վարդենիս: 'Vardenis',
  Սևան: 'Sevan',
  Մարտունի: 'Martuni',
  Վանաձոր: 'Vanadzor',
  Զովունի: 'Zovuni',
  Հրազդան: 'Hrazdan',
  Չարենցավան: 'Charentsavan',
  Աբովյան: 'Abovyan',
  Առինջ: 'Arinj',
  Պռոշյան: 'Proshyan',
  Գյումրի: 'Gyumri',
  Կապան: 'Kapan',
  Գորիս: 'Goris',
  Քաջարան: 'Kajaran',
  Քաջարանց: 'Kajaran',
  Եղեգնաձոր: 'Yeghegnadzor',
  Բերդ: 'Berd',
  Իջևան: 'Ijevan',
  Կաման: 'Kapan',
};

const STREET_LEVEL_ADDR_TYPES = new Set([
  'PointAddress',
  'StreetAddress',
  'StreetAddressExt',
  'StreetName',
  'Subaddress',
]);
const POI_ADDR_TYPES = new Set(['POI']);
const EARTH_RADIUS_KM = 6371;
const REQUEST_GAP_MS = 120;

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

function parseXlsxWithPython() {
  const script = `
import zipfile, xml.etree.ElementTree as ET, json
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
path = ${JSON.stringify(XLSX_PATH)}
with zipfile.ZipFile(path) as z:
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('m:si', ns):
            texts = [t.text or '' for t in si.findall('.//m:t', ns)]
            ss.append(''.join(texts))
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = [(sh.attrib.get('name'), sh.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')) for sh in wb.findall('m:sheets/m:sheet', ns)]
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rid_to_target = {r.attrib['Id']: r.attrib['Target'] for r in rels}
    def cell_val(c):
        t = c.attrib.get('t')
        if t == 'inlineStr':
            texts = [x.text or '' for x in c.findall('.//m:t', ns)]
            return ''.join(texts) if texts else None
        v = c.find('m:v', ns)
        if v is None:
            return None
        return ss[int(v.text)] if t == 's' else v.text
    out = []
    for name, rid in sheets:
        target = rid_to_target[rid].lstrip('/')
        if not target.startswith('xl/'):
            target = 'xl/' + target
        root = ET.fromstring(z.read(target))
        rows = []
        for row in root.findall('m:sheetData/m:row', ns):
            vals = [cell_val(c) for c in row.findall('m:c', ns)]
            if not vals or not vals[0]:
                continue
            address = (vals[1] or '').strip() if len(vals) > 1 else ''
            rows.append({'name': vals[0].strip(), 'address': address})
        out.append({'region': name, 'rows': rows})
    print(json.dumps(out, ensure_ascii=False))
`;
  const result = execFileSync('python3', ['-c', script], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  return JSON.parse(result);
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

function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(hav));
}

function parseCityStreet(raw) {
  const address = String(raw || '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!address) {
    return { kind: 'empty', raw: address };
  }
  if (/^օնլայն$/iu.test(address)) {
    return { kind: 'online', raw: address };
  }

  let street = address;
  const cityMatch = address.match(/^քաղաք\s+(.+)$/iu);
  const villageMatch = address.match(/^գյուղ\s+(.+)$/iu);
  if (cityMatch) {
    street = cityMatch[1].trim();
  } else if (villageMatch) {
    street = villageMatch[1].trim();
  }
  street = street.replace(/^Ք[\.․]\s*/u, '').replace(/^Գ[\.․]\s*/u, '');

  let cityHy = null;
  const cities = Object.keys(CITY_EN).sort((left, right) => right.length - left.length);
  for (const city of cities) {
    if (
      street === city ||
      street.startsWith(`${city} `) ||
      street.startsWith(`${city},`)
    ) {
      cityHy = city === 'Կաման' ? 'Կապան' : city;
      street = street.slice(city.length).replace(/^[\s,]+/u, '').trim();
      break;
    }
  }

  if (!cityHy) {
    for (const city of cities) {
      if (address.startsWith(`${city} `)) {
        cityHy = city;
        street = address.slice(city.length).trim();
        break;
      }
    }
  }

  return {
    kind: 'ok',
    raw: address,
    cityHy,
    cityEn: cityHy ? CITY_EN[cityHy] : null,
    street: street || address,
  };
}

function pickCandidate(candidates, addrTypes, minScore, anchor) {
  for (const candidate of candidates) {
    if ((candidate.score ?? 0) < minScore) {
      continue;
    }
    if (!addrTypes.has(candidate.attributes?.Addr_type ?? '')) {
      continue;
    }
    const lat = Number(candidate.location?.y);
    const lng = Number(candidate.location?.x);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      continue;
    }
    if (anchor && distanceKm({ lat, lng }, anchor) > anchor.maxKm) {
      continue;
    }
    return { lat, lng, score: candidate.score, type: candidate.attributes.Addr_type };
  }
  return null;
}

async function geocodeStreetAddress(address, regionEn, cache) {
  const cacheKey = `${address}__${regionEn}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const parsed = parseCityStreet(address);
  if (parsed.kind !== 'ok') {
    cache.set(cacheKey, null);
    return null;
  }

  const anchor = REGION_ANCHORS[regionEn] || null;
  const cityEn = parsed.cityEn || regionEn;
  const lines = [];
  if (parsed.cityHy) {
    lines.push(`${parsed.street}, ${parsed.cityHy}, Armenia`);
    lines.push(`${parsed.street}, ${parsed.cityHy}, ${regionEn}, Armenia`);
    if (parsed.cityEn) {
      lines.push(`${parsed.street}, ${parsed.cityEn}, Armenia`);
    }
  }
  lines.push(`${parsed.street}, ${regionEn}, Armenia`);
  lines.push(`${parsed.raw}, ${regionEn}, Armenia`);

  let coords = null;
  try {
    for (const singleLine of [...new Set(lines)]) {
      const params = new URLSearchParams({
        f: 'json',
        singleLine,
        maxLocations: '8',
        outFields: 'Addr_type,Match_addr',
        forStorage: 'false',
        countryCode: 'ARM',
        city: cityEn,
      });
      const response = await fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params}`,
        {
          headers: {
            'User-Agent': 'JanazyanPartnerStoresImport/1.0',
            Accept: 'application/json',
          },
        },
      );
      if (!response.ok) {
        continue;
      }
      const payload = await response.json();
      const list = payload.candidates ?? [];
      const street = pickCandidate(list, STREET_LEVEL_ADDR_TYPES, 75, anchor);
      if (street) {
        coords = street;
        break;
      }
      const poi = pickCandidate(list, POI_ADDR_TYPES, 70, anchor);
      if (poi) {
        coords = poi;
        break;
      }
    }
  } catch {
    coords = null;
  }

  cache.set(cacheKey, coords);
  await new Promise((resolve) => setTimeout(resolve, REQUEST_GAP_MS));
  return coords;
}

async function main() {
  loadEnv();
  if (!fs.existsSync(XLSX_PATH)) {
    throw new Error(`Missing ${XLSX_PATH}`);
  }

  const sheets = parseXlsxWithPython();
  const prisma = new PrismaClient();
  const coordsCache = new Map();

  let createdRegions = 0;
  let createdStores = 0;
  const skipped = [];

  try {
    const maxPos = await prisma.partnerStoreRegion.aggregate({
      where: { deletedAt: null },
      _max: { position: true },
    });
    let nextRegionPosition = (maxPos._max.position ?? -1) + 1;

    for (let regionIndex = 0; regionIndex < sheets.length; regionIndex += 1) {
      const sheet = sheets[regionIndex];
      const regionHy = sheet.region;
      const regionEn = REGION_EN[regionHy] || regionHy;

      const importable = [];
      for (let storeIndex = 0; storeIndex < sheet.rows.length; storeIndex += 1) {
        const row = sheet.rows[storeIndex];
        const storeName = row.name;
        const address = row.address || storeName;
        const parsed = parseCityStreet(address);
        if (parsed.kind === 'online' || parsed.kind === 'empty') {
          skipped.push({ region: regionHy, name: storeName, address, reason: parsed.kind });
          continue;
        }
        const coords = await geocodeStreetAddress(address, regionEn, coordsCache);
        if (!coords) {
          skipped.push({ region: regionHy, name: storeName, address, reason: 'not_found' });
          continue;
        }
        importable.push({ storeName, address, coords, storeIndex });
      }

      if (importable.length === 0) {
        continue;
      }

      const regionSlug = toSlug(regionEn);
      const region = await prisma.partnerStoreRegion.create({
        data: {
          slug: `${regionSlug}-${regionIndex + 1}`,
          position: nextRegionPosition,
          published: true,
          translations: {
            create: localeNames(regionHy, regionEn),
          },
        },
      });
      nextRegionPosition += 1;
      createdRegions += 1;

      for (let i = 0; i < importable.length; i += 1) {
        const item = importable[i];
        const storeSlug = toSlug(`${regionEn}-${item.storeName}-${item.storeIndex + 1}`);
        await prisma.partnerStore.create({
          data: {
            slug: storeSlug,
            regionId: region.id,
            areaId: null,
            lat: item.coords.lat,
            lng: item.coords.lng,
            position: i,
            published: true,
            translations: {
              create: [
                { locale: 'en', name: item.storeName, address: item.address, logoAlt: item.storeName },
                { locale: 'hy', name: item.storeName, address: item.address, logoAlt: item.storeName },
                { locale: 'ru', name: item.storeName, address: item.address, logoAlt: item.storeName },
              ],
            },
          },
        });
        createdStores += 1;
      }
    }

    console.log(
      JSON.stringify(
        {
          createdRegions,
          createdAreas: 0,
          createdStores,
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
