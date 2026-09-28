function trimLeadingZeros(value: string): string {
  const normalized = value.replace(/^0+/, "");
  return normalized.length > 0 ? normalized : "0";
}

/**
 * Canonical SKU form used for ArmSoft ↔ shop matching.
 */
export function normalizeSku(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const upper = trimmed.replace(/\s+/g, "").toUpperCase();
  if (/^\d+$/.test(upper)) {
    return trimLeadingZeros(upper);
  }

  return upper;
}

/**
 * Return candidate SKU keys for tolerant matching.
 */
export function buildSkuCandidates(value: string): string[] {
  const trimmed = value.trim();
  const normalized = normalizeSku(trimmed);
  const candidates = new Set<string>();

  if (trimmed) {
    candidates.add(trimmed);
    candidates.add(trimmed.toUpperCase());
  }
  if (normalized) {
    candidates.add(normalized);
  }

  return [...candidates];
}
