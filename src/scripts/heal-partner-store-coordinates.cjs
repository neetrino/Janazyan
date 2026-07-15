/**
 * Heals partner-store map coordinates that were imported as district/region centroids,
 * and corrects points that left their region (wrong-city street matches).
 *
 * Usage: node src/scripts/heal-partner-store-coordinates.cjs
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const ROOT = path.resolve(__dirname, '../..');
const ARCGIS_GEOCODE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const STREET_LEVEL_ADDR_TYPES = new Set([
  'PointAddress',
  'StreetAddress',
  'StreetAddressExt',
  'StreetName',
  'Subaddress',
]);
const ARCGIS_MIN_SCORE = 80;
const DUPLICATE_PRECISION = 5;
const CLUSTER_MIN = 2;
const MOVE_EPSILON = 0.00015;
const REQUEST_GAP_MS = 120;
const EARTH_RADIUS_KM = 6371;

/** Rough region centers used as geocode anchors (wrong-city guard). */
const REGION_ANCHORS = {
  Yerevan: { lat: 40.1772, lng: 44.5126, maxKm: 18 },
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickEnName(translations) {
  return (
    translations.find((translation) => translation.locale === 'en')?.name ??
    translations[0]?.name ??
    null
  );
}

function pickAddress(translations) {
  return (
    translations.find((translation) => translation.locale === 'en')?.address ??
    translations[0]?.address ??
    null
  );
}

function coordinateKey(lat, lng) {
  return `${lat.toFixed(DUPLICATE_PRECISION)},${lng.toFixed(DUPLICATE_PRECISION)}`;
}

function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(hav));
}

function resolveRegionAnchor(regionName) {
  if (!regionName) {
    return null;
  }
  if (REGION_ANCHORS[regionName]) {
    return REGION_ANCHORS[regionName];
  }
  const match = Object.entries(REGION_ANCHORS).find(
    ([name]) => name.toLowerCase() === regionName.toLowerCase(),
  );
  return match ? match[1] : null;
}

function parseCandidate(candidate) {
  const lat = Number(candidate?.location?.y);
  const lng = Number(candidate?.location?.x);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return { lat, lng };
}

function isNearAnchor(coordinates, anchor) {
  if (!anchor) {
    return true;
  }
  return distanceKm(coordinates, anchor) <= anchor.maxKm;
}

async function geocodeStreet(address, regionName, anchor) {
  const queries = [
    regionName ? `${address}, ${regionName}, Armenia` : null,
    `${address}, Armenia`,
    address,
  ].filter(Boolean);

  for (const singleLine of queries) {
    const params = new URLSearchParams({
      f: 'json',
      singleLine,
      maxLocations: '8',
      outFields: 'Addr_type,Match_addr,City,Country',
      forStorage: 'false',
    });
    if (regionName) {
      params.set('city', regionName);
      params.set('countryCode', 'ARM');
    }

    const response = await fetch(`${ARCGIS_GEOCODE_URL}?${params}`, {
      headers: {
        'User-Agent': 'JanazyanPartnerStoresHeal/1.0',
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      continue;
    }

    const payload = await response.json();
    for (const candidate of payload.candidates ?? []) {
      if ((candidate.score ?? 0) < ARCGIS_MIN_SCORE) {
        continue;
      }
      if (!STREET_LEVEL_ADDR_TYPES.has(candidate.attributes?.Addr_type)) {
        continue;
      }
      const parsed = parseCandidate(candidate);
      if (parsed && isNearAnchor(parsed, anchor)) {
        return parsed;
      }
    }
  }

  return null;
}

async function main() {
  loadEnv();
  const prisma = new PrismaClient();
  const stats = { checked: 0, updated: 0, skipped: 0, failed: 0, outOfRegionFixed: 0 };

  try {
    const stores = await prisma.partnerStore.findMany({
      where: { deletedAt: null },
      include: {
        translations: true,
        region: { include: { translations: true } },
        area: { include: { translations: true } },
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    const counts = new Map();
    for (const store of stores) {
      const key = coordinateKey(store.lat, store.lng);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const targets = stores.filter((store) => {
      const regionName = pickEnName(store.region.translations);
      const anchor = resolveRegionAnchor(regionName);
      const clustered = (counts.get(coordinateKey(store.lat, store.lng)) ?? 0) >= CLUSTER_MIN;
      const outOfRegion = anchor
        ? !isNearAnchor({ lat: store.lat, lng: store.lng }, anchor)
        : false;
      return clustered || outOfRegion;
    });
    stats.checked = targets.length;

    for (const store of targets) {
      const address = pickAddress(store.translations);
      const regionName = pickEnName(store.region.translations);
      const anchor = resolveRegionAnchor(regionName);
      if (!address) {
        stats.failed += 1;
        continue;
      }

      const wasOutOfRegion = anchor
        ? !isNearAnchor({ lat: store.lat, lng: store.lng }, anchor)
        : false;

      const geocoded = await geocodeStreet(address, regionName, anchor);
      await sleep(REQUEST_GAP_MS);

      if (!geocoded) {
        // Pull wrong-city pins back to region center rather than leaving them elsewhere.
        if (wasOutOfRegion && anchor) {
          await prisma.partnerStore.update({
            where: { id: store.id },
            data: { lat: anchor.lat, lng: anchor.lng },
          });
          stats.updated += 1;
          stats.outOfRegionFixed += 1;
          console.log(`RESET ${address} → region anchor (${regionName})`);
          continue;
        }
        stats.failed += 1;
        console.log(`FAIL ${store.id} ${address}`);
        continue;
      }

      const moved =
        Math.abs(store.lat - geocoded.lat) > MOVE_EPSILON ||
        Math.abs(store.lng - geocoded.lng) > MOVE_EPSILON;
      if (!moved) {
        stats.skipped += 1;
        continue;
      }

      await prisma.partnerStore.update({
        where: { id: store.id },
        data: { lat: geocoded.lat, lng: geocoded.lng },
      });
      stats.updated += 1;
      if (wasOutOfRegion) {
        stats.outOfRegionFixed += 1;
      }
      console.log(
        `OK ${address} → ${geocoded.lat.toFixed(6)},${geocoded.lng.toFixed(6)} (${regionName ?? '-'})`,
      );
    }

    console.log(JSON.stringify(stats, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
