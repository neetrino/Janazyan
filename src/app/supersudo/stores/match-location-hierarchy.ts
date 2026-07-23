import type {
  AdminPartnerStoreArea,
  AdminPartnerStoreRegion,
} from './types';

const MIN_PARTIAL_MATCH_LENGTH = 3;

type NamedHierarchyItem = {
  id: string;
  slug: string;
  name: string;
  translations: Array<{ locale: string; name: string }>;
};

/**
 * Normalizes place / hierarchy names for loose equality matching.
 */
export function normalizeHierarchyName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(province|marz|region|district|municipality|oblast)\b/gi, ' ')
    .replace(/\b(մարզ|շրջան|քաղաք|համայնք)\b/giu, ' ')
    .replace(/\b(область|район|город|муниципалитет)\b/giu, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectItemLabels(item: NamedHierarchyItem): string[] {
  const labels = [
    item.name,
    item.slug.replace(/-/g, ' '),
    ...item.translations.map((translation) => translation.name),
  ];
  return labels
    .map((label) => normalizeHierarchyName(label))
    .filter((label) => label.length > 0);
}

function scoreNameMatch(candidate: string, label: string): number {
  const normalizedCandidate = normalizeHierarchyName(candidate);
  if (!normalizedCandidate || !label) {
    return 0;
  }
  if (normalizedCandidate === label) {
    return 100;
  }
  if (
    normalizedCandidate.length >= MIN_PARTIAL_MATCH_LENGTH &&
    label.length >= MIN_PARTIAL_MATCH_LENGTH
  ) {
    if (label.includes(normalizedCandidate) || normalizedCandidate.includes(label)) {
      return 70;
    }
  }
  return 0;
}

function findBestMatch<T extends NamedHierarchyItem>(
  candidates: string[],
  items: T[],
): T | null {
  let bestItem: T | null = null;
  let bestScore = 0;

  for (const item of items) {
    const labels = collectItemLabels(item);
    for (const candidate of candidates) {
      for (const label of labels) {
        const score = scoreNameMatch(candidate, label);
        if (score > bestScore) {
          bestScore = score;
          bestItem = item;
        }
      }
    }
  }

  return bestScore > 0 ? bestItem : null;
}

export type MatchedPartnerStoreHierarchy = {
  regionId: string | null;
  areaId: string | null;
  matchedRegionName: string | null;
  matchedAreaName: string | null;
};

/**
 * Maps reverse-geocode place candidates onto admin region/area hierarchy rows.
 */
export function matchPartnerStoreHierarchy(params: {
  regionCandidates: string[];
  regionFallbackCandidates?: string[];
  areaCandidates: string[];
  regions: AdminPartnerStoreRegion[];
  areas: AdminPartnerStoreArea[];
}): MatchedPartnerStoreHierarchy {
  const region =
    findBestMatch(params.regionCandidates, params.regions) ??
    findBestMatch(params.regionFallbackCandidates ?? [], params.regions);

  if (!region) {
    return {
      regionId: null,
      areaId: null,
      matchedRegionName: null,
      matchedAreaName: null,
    };
  }

  const areasForRegion = params.areas.filter((area) => area.regionId === region.id);
  const area = findBestMatch(params.areaCandidates, areasForRegion);

  return {
    regionId: region.id,
    areaId: area?.id ?? null,
    matchedRegionName: region.name,
    matchedAreaName: area?.name ?? null,
  };
}
