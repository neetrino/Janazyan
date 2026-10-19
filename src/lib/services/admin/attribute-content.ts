import { db } from '@white-shop/db';
import { toSlug } from '@/lib/utils/slug';
import type { NamedLocaleRow } from './category-content';

const KEY_ATTEMPT_LIMIT = 1000;

export async function reserveAttributeKey(baseInput: string, excludeAttributeId?: string): Promise<string> {
  const baseKey = toSlug(baseInput) || 'item';
  for (let attempt = 0; attempt < KEY_ATTEMPT_LIMIT; attempt += 1) {
    const candidate = attempt === 0 ? baseKey : `${baseKey}-${attempt}`;
    const clash = await db.attribute.findFirst({
      where: {
        key: candidate,
        ...(excludeAttributeId ? { id: { not: excludeAttributeId } } : {}),
      },
      select: { id: true },
    });
    if (!clash) {
      return candidate;
    }
  }

  throw new Error(`Unable to reserve attribute key '${baseKey}'`);
}

export function attributeValueKey(input: string): string {
  return toSlug(input) || 'item';
}

export async function saveAttributeNames(attributeId: string, rows: NamedLocaleRow[]): Promise<void> {
  for (const row of rows) {
    await db.attributeTranslation.upsert({
      where: { attributeId_locale: { attributeId, locale: row.locale } },
      update: { name: row.text },
      create: { attributeId, locale: row.locale, name: row.text },
    });
  }

  await db.attributeTranslation.deleteMany({
    where: { attributeId, locale: { notIn: rows.map((row) => row.locale) } },
  });
}

export async function saveAttributeValueLabels(attributeValueId: string, rows: NamedLocaleRow[]): Promise<void> {
  for (const row of rows) {
    await db.attributeValueTranslation.upsert({
      where: { attributeValueId_locale: { attributeValueId, locale: row.locale } },
      update: { label: row.text },
      create: { attributeValueId, locale: row.locale, label: row.text },
    });
  }

  await db.attributeValueTranslation.deleteMany({
    where: { attributeValueId, locale: { notIn: rows.map((row) => row.locale) } },
  });
}
