#!/usr/bin/env node
/**
 * One-time: rewrite non-ASCII product_translations.slug to Latin ASCII.
 *
 * Usage:
 *   node src/scripts/normalize-product-slugs-to-latin.cjs --dry-run
 *   node src/scripts/normalize-product-slugs-to-latin.cjs --apply
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const ASCII_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_INPUT_LENGTH = 500;
const FALLBACK = 'product';
const MAX_SLUG_ATTEMPTS = 1000;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), '.env'));
loadEnvFile(path.join(process.cwd(), '.env.local'));

const ARMENIAN_DIGRAPHS = [
  ['\u0578\u0582', 'u'],
  ['\u0548\u0582', 'u'],
  ['\u0548\u0552', 'u'],
  ['\u0587', 'ev'],
  ['\u0535\u057e', 'ev'],
];

const ARMENIAN_LETTER_ROWS = [
  [0x0561, 0x0531, 'a'],
  [0x0562, 0x0532, 'b'],
  [0x0563, 0x0533, 'g'],
  [0x0564, 0x0534, 'd'],
  [0x0565, 0x0535, 'e'],
  [0x0566, 0x0536, 'z'],
  [0x0567, 0x0537, 'e'],
  [0x0568, 0x0538, 'y'],
  [0x0569, 0x0539, 't'],
  [0x056a, 0x053a, 'zh'],
  [0x056b, 0x053b, 'i'],
  [0x056c, 0x053c, 'l'],
  [0x056d, 0x053d, 'kh'],
  [0x056e, 0x053e, 'ts'],
  [0x056f, 0x053f, 'k'],
  [0x0570, 0x0540, 'h'],
  [0x0571, 0x0541, 'dz'],
  [0x0572, 0x0542, 'gh'],
  [0x0573, 0x0543, 'ch'],
  [0x0574, 0x0544, 'm'],
  [0x0575, 0x0545, 'y'],
  [0x0576, 0x0546, 'n'],
  [0x0577, 0x0547, 'sh'],
  [0x0578, 0x0548, 'o'],
  [0x0579, 0x0549, 'ch'],
  [0x057a, 0x054a, 'p'],
  [0x057b, 0x054b, 'j'],
  [0x057c, 0x054c, 'r'],
  [0x057d, 0x054d, 's'],
  [0x057e, 0x054e, 'v'],
  [0x057f, 0x054f, 't'],
  [0x0580, 0x0550, 'r'],
  [0x0581, 0x0551, 'ts'],
  [0x0582, 0x0552, 'w'],
  [0x0583, 0x0553, 'p'],
  [0x0584, 0x0554, 'q'],
  [0x0585, 0x0555, 'o'],
  [0x0586, 0x0556, 'f'],
];

const CYRILLIC_LETTER_ROWS = [
  [0x0430, 'a'],
  [0x0431, 'b'],
  [0x0432, 'v'],
  [0x0433, 'g'],
  [0x0434, 'd'],
  [0x0435, 'e'],
  [0x0451, 'e'],
  [0x0436, 'zh'],
  [0x0437, 'z'],
  [0x0438, 'i'],
  [0x0439, 'y'],
  [0x043a, 'k'],
  [0x043b, 'l'],
  [0x043c, 'm'],
  [0x043d, 'n'],
  [0x043e, 'o'],
  [0x043f, 'p'],
  [0x0440, 'r'],
  [0x0441, 's'],
  [0x0442, 't'],
  [0x0443, 'u'],
  [0x0444, 'f'],
  [0x0445, 'kh'],
  [0x0446, 'ts'],
  [0x0447, 'ch'],
  [0x0448, 'sh'],
  [0x0449, 'shch'],
  [0x044a, ''],
  [0x044b, 'y'],
  [0x044c, ''],
  [0x044d, 'e'],
  [0x044e, 'yu'],
  [0x044f, 'ya'],
  [0x0410, 'a'],
  [0x0411, 'b'],
  [0x0412, 'v'],
  [0x0413, 'g'],
  [0x0414, 'd'],
  [0x0415, 'e'],
  [0x0401, 'e'],
  [0x0416, 'zh'],
  [0x0417, 'z'],
  [0x0418, 'i'],
  [0x0419, 'y'],
  [0x041a, 'k'],
  [0x041b, 'l'],
  [0x041c, 'm'],
  [0x041d, 'n'],
  [0x041e, 'o'],
  [0x041f, 'p'],
  [0x0420, 'r'],
  [0x0421, 's'],
  [0x0422, 't'],
  [0x0423, 'u'],
  [0x0424, 'f'],
  [0x0425, 'kh'],
  [0x0426, 'ts'],
  [0x0427, 'ch'],
  [0x0428, 'sh'],
  [0x0429, 'shch'],
  [0x042a, ''],
  [0x042b, 'y'],
  [0x042c, ''],
  [0x042d, 'e'],
  [0x042e, 'yu'],
  [0x042f, 'ya'],
];

const ARMENIAN_LETTERS = Object.create(null);
for (const [lo, up, lat] of ARMENIAN_LETTER_ROWS) {
  ARMENIAN_LETTERS[String.fromCharCode(lo)] = lat;
  ARMENIAN_LETTERS[String.fromCharCode(up)] = lat;
}

const CYRILLIC_LETTERS = Object.create(null);
for (const [cp, lat] of CYRILLIC_LETTER_ROWS) {
  CYRILLIC_LETTERS[String.fromCharCode(cp)] = lat;
}

function transliterateForSlug(input) {
  let out = String(input);
  for (const [from, to] of ARMENIAN_DIGRAPHS) {
    out = out.split(from).join(to);
  }
  let result = '';
  for (const char of out) {
    result += ARMENIAN_LETTERS[char] ?? CYRILLIC_LETTERS[char] ?? char;
  }
  return result;
}

function toSlug(input) {
  const s = transliterateForSlug(input).toLowerCase().trim();
  let out = '';
  let prevWasHyphen = false;
  for (let i = 0; i < Math.min(s.length, MAX_SLUG_INPUT_LENGTH); i += 1) {
    const c = s[i];
    const isAlnum = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9');
    if (isAlnum) {
      out += c;
      prevWasHyphen = false;
    } else if (!prevWasHyphen && out.length > 0) {
      out += '-';
      prevWasHyphen = true;
    }
  }
  return out.replace(/-+$/g, '');
}

function needsLatinNormalize(slug) {
  return !ASCII_SLUG.test(String(slug || '').trim());
}

async function ensureUnique(tx, baseSlug, locale, excludeId, reserved) {
  const base = toSlug(baseSlug) || FALLBACK;
  const reserveKey = (slug) => `${locale}::${slug}`;
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt}`;
    if (reserved.has(reserveKey(candidate))) continue;
    const existing = await tx.productTranslation.findFirst({
      where: {
        slug: candidate,
        locale,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) {
      reserved.add(reserveKey(candidate));
      return candidate;
    }
  }
  throw new Error(`Unable to allocate unique slug for ${base} / ${locale}`);
}

async function main() {
  const apply = process.argv.includes('--apply');
  const dryRun = !apply;
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.productTranslation.findMany({
      select: { id: true, productId: true, locale: true, slug: true, title: true },
      orderBy: [{ locale: 'asc' }, { slug: 'asc' }],
    });
    const targets = rows.filter((row) => needsLatinNormalize(row.slug));
    console.log(
      '[normalize-product-slugs] total=',
      rows.length,
      'nonAscii=',
      targets.length,
      dryRun ? '(dry-run)' : '(APPLY)',
    );

    const planned = [];
    const reserved = new Set();
    for (const row of targets) {
      const next = await ensureUnique(
        prisma,
        row.slug || row.title || FALLBACK,
        row.locale,
        row.id,
        reserved,
      );
      planned.push({ id: row.id, locale: row.locale, from: row.slug, to: next });
      if (planned.length <= 8) {
        console.log('  ', row.locale, row.slug, '=>', next);
      }
    }
    if (planned.length > 8) {
      console.log('  ... and', planned.length - 8, 'more');
    }

    if (dryRun) {
      console.log('[normalize-product-slugs] Dry run only. Re-run with --apply to persist.');
      return;
    }

    let updated = 0;
    for (const item of planned) {
      if (item.from === item.to) continue;
      await prisma.productTranslation.update({
        where: { id: item.id },
        data: { slug: item.to },
      });
      updated += 1;
    }
    console.log('[normalize-product-slugs] Updated', updated, 'rows.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
