/**
 * One-off import: Marzer.xlsx → partner store hierarchy (2 levels)
 * Region (sheet) → Store (no areas)
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
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in root.findall('m:si', ns):
        texts = [t.text or '' for t in si.findall('.//m:t', ns)]
        ss.append(''.join(texts))
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = [(sh.attrib.get('name'), sh.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')) for sh in wb.findall('m:sheets/m:sheet', ns)]
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rid_to_target = {r.attrib['Id']: r.attrib['Target'] for r in rels}
    def cell_val(c):
        t = c.attrib.get('t'); v = c.find('m:v', ns)
        if v is None: return None
        return ss[int(v.text)] if t=='s' else v.text
    out = []
    for name, rid in sheets:
        target = rid_to_target[rid]
        if not target.startswith('xl/'): target = 'xl/' + target
        root = ET.fromstring(z.read(target))
        rows = []
        for row in root.findall('m:sheetData/m:row', ns):
            vals = [cell_val(c) for c in row.findall('m:c', ns)]
            if not vals or not vals[0]:
                continue
            rows.append({'name': vals[0].strip(), 'address': (vals[1] or '').strip()})
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

async function resolveRegionCoords(regionEn, cache) {
  if (cache.has(regionEn)) {
    return cache.get(regionEn);
  }
  let lat = 40.1792;
  let lng = 44.4991;
  try {
    const query = encodeURIComponent(`${regionEn}, Armenia`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'JanazyanPartnerStoresImport/1.0',
          Accept: 'application/json',
        },
      },
    );
    if (response.ok) {
      const results = await response.json();
      if (results[0]) {
        lat = Number.parseFloat(results[0].lat);
        lng = Number.parseFloat(results[0].lon);
      }
    }
  } catch {
    // keep fallback
  }
  const coords = { lat, lng };
  cache.set(regionEn, coords);
  await new Promise((resolve) => setTimeout(resolve, 1100));
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

  try {
    for (let regionIndex = 0; regionIndex < sheets.length; regionIndex += 1) {
      const sheet = sheets[regionIndex];
      const regionHy = sheet.region;
      const regionEn = REGION_EN[regionHy] || regionHy;
      const regionSlug = toSlug(regionEn);

      const region = await prisma.partnerStoreRegion.create({
        data: {
          slug: `${regionSlug}-${regionIndex + 1}`,
          position: regionIndex,
          published: true,
          translations: {
            create: localeNames(regionHy, regionEn),
          },
        },
      });
      createdRegions += 1;

      const coords = await resolveRegionCoords(regionEn, coordsCache);

      for (let storeIndex = 0; storeIndex < sheet.rows.length; storeIndex += 1) {
        const row = sheet.rows[storeIndex];
        const storeName = row.name;
        const address = row.address || storeName;
        const storeSlug = toSlug(`${regionEn}-${storeName}-${storeIndex + 1}`);

        await prisma.partnerStore.create({
          data: {
            slug: storeSlug,
            regionId: region.id,
            areaId: null,
            lat: coords.lat,
            lng: coords.lng,
            position: storeIndex,
            published: true,
            translations: {
              create: [
                { locale: 'en', name: storeName, address, logoAlt: storeName },
                { locale: 'hy', name: storeName, address, logoAlt: storeName },
                { locale: 'ru', name: storeName, address, logoAlt: storeName },
              ],
            },
          },
        });
        createdStores += 1;
      }
    }

    console.log(JSON.stringify({ createdRegions, createdAreas: 0, createdStores }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
