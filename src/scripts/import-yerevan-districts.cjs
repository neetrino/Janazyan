/**
 * Import: Varchakan shrjanner.xlsx → 3-level hierarchy
 * Region: Երևան → Area: sheet (district) → Store
 *
 * Usage: node src/scripts/import-yerevan-districts.cjs
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const ROOT = path.resolve(__dirname, '../..');
const XLSX_PATH = path.join(ROOT, 'Varchakan shrjanner.xlsx');

const DISTRICT_EN = {
  Կենտրոն: 'Kentron',
  'Նոր-նորք': 'Nor Nork',
  Ավան: 'Avan',
  Արաբկիր: 'Arabkir',
  Դավթաշեն: 'Davtashen',
  Աջափնյակ: 'Ajapnyak',
  էրեբունի: 'Erebuni',
  Էրեբունի: 'Erebuni',
  'Մալաթիա-Սեբաստիա': 'Malatia-Sebastia',
  Շենգավիթ: 'Shengavit',
  'Քանաքեռ-Զեյթուն': 'Kanaker-Zeytun',
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
        out.append({'district': name, 'rows': rows})
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

const STREET_LEVEL_ADDR_TYPES = new Set([
  'PointAddress',
  'StreetAddress',
  'StreetAddressExt',
  'StreetName',
  'Subaddress',
]);
const YEREVAN_FALLBACK = { lat: 40.1792, lng: 44.4991 };

function buildGeocodeQueries(address, regionEn) {
  const variants = [address];
  const replacements = [
    [/\bՄաշտոց\b/u, 'Մեսրոպ Մաշտոցի պողոտա'],
    [/\bԲաղրամյան\b/u, 'Մարշալ Բաղրամյան պողոտա'],
    [/\bԿոմիտաս\b/u, 'Կոմիտասի պողոտա'],
    [/\bԱրշակունյաց\b/u, 'Արշակունյաց պողոտա'],
    [/\bՏիգրան Մեծ\b/u, 'Տիգրան Մեծի պողոտա'],
  ];
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(address) && !address.includes(replacement)) {
      variants.push(address.replace(pattern, replacement));
    }
  }

  const queries = [];
  for (const variant of variants) {
    queries.push(`${variant}, ${regionEn}, Armenia`);
    queries.push(`${variant}, Armenia`);
  }
  return [...new Set(queries)];
}

async function geocodeStreetAddress(address, regionEn, cache) {
  const cacheKey = `${address}__${regionEn}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  let coords = { ...YEREVAN_FALLBACK };
  try {
    for (const singleLine of buildGeocodeQueries(address, regionEn)) {
      const params = new URLSearchParams({
        f: 'json',
        singleLine,
        maxLocations: '8',
        outFields: 'Addr_type',
        forStorage: 'false',
        city: regionEn,
        countryCode: 'ARM',
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
      const match = (payload.candidates ?? []).find(
        (candidate) =>
          (candidate.score ?? 0) >= 80 &&
          STREET_LEVEL_ADDR_TYPES.has(candidate.attributes?.Addr_type),
      );
      if (match?.location) {
        coords = {
          lat: Number(match.location.y),
          lng: Number(match.location.x),
        };
        break;
      }
    }
  } catch {
    // keep fallback centroid
  }

  cache.set(cacheKey, coords);
  await new Promise((resolve) => setTimeout(resolve, 120));
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

  let createdAreas = 0;
  let createdStores = 0;

  try {
    const existing = await prisma.partnerStoreRegion.findFirst({
      where: {
        deletedAt: null,
        OR: [{ slug: { startsWith: 'yerevan' } }, { translations: { some: { name: 'Երևան' } } }],
      },
    });

    let region = existing;
    if (!region) {
      const maxPos = await prisma.partnerStoreRegion.aggregate({
        where: { deletedAt: null },
        _max: { position: true },
      });
      region = await prisma.partnerStoreRegion.create({
        data: {
          slug: 'yerevan',
          position: (maxPos._max.position ?? -1) + 1,
          published: true,
          translations: {
            create: localeNames('Երևան', 'Yerevan'),
          },
        },
      });
    }

    for (let areaIndex = 0; areaIndex < sheets.length; areaIndex += 1) {
      const sheet = sheets[areaIndex];
      const districtHy = sheet.district;
      const districtEn = DISTRICT_EN[districtHy] || districtHy;
      const areaSlug = `${toSlug(districtEn)}-${areaIndex + 1}`;

      const area = await prisma.partnerStoreArea.create({
        data: {
          regionId: region.id,
          slug: areaSlug,
          position: areaIndex,
          published: true,
          translations: {
            create: localeNames(districtHy, districtEn),
          },
        },
      });
      createdAreas += 1;

      for (let storeIndex = 0; storeIndex < sheet.rows.length; storeIndex += 1) {
        const row = sheet.rows[storeIndex];
        const storeName = row.name;
        const address = row.address || storeName;
        const storeSlug = toSlug(`yerevan-${districtEn}-${storeName}-${storeIndex + 1}`);
        const coords = await geocodeStreetAddress(address, 'Yerevan', coordsCache);

        await prisma.partnerStore.create({
          data: {
            slug: storeSlug,
            regionId: region.id,
            areaId: area.id,
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

    console.log(
      JSON.stringify(
        {
          regionId: region.id,
          region: 'Երևան / Yerevan',
          createdAreas,
          createdStores,
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
