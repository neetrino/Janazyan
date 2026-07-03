import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const PUBLIC_ROOT = path.resolve('public');

const WEBP_QUALITY = 80;
const WEBP_EFFORT = 6;
const JPEG_QUALITY = 82;
const PNG_COMPRESSION = 9;

const DEFAULT_MAX_WIDTH = 1280;
const PRODUCT_MEDIA_MAX_WIDTH = 1200;
const PARTNER_STORE_MAX_WIDTH = 800;

/** Max width for figma raster assets (key = file stem). */
const FIGMA_MAX_WIDTHS = {
  'about-hero': 1024,
  'category-body': 900,
  'category-face': 900,
  'category-hair': 900,
  'category-kids': 900,
  'featured-product': 768,
  'contact-hero': 900,
  'footer-decoration': 900,
  'footer-decoration-desktop': 900,
  'footer-logo': 512,
  'header-logo': 512,
  'hero-body-wash': 1280,
  'hero-jellyfish': 1280,
  'login-hero-decoration': 900,
  'promo-cosmetic': 900,
  'promo-poster-photo': 1280,
};

const RASTER_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif']);

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function resolveMaxWidth(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  const stem = path.basename(normalized, path.extname(normalized));

  if (normalized.startsWith('figma/')) {
    return FIGMA_MAX_WIDTHS[stem] ?? DEFAULT_MAX_WIDTH;
  }
  if (normalized.startsWith('product-media/')) {
    return PRODUCT_MEDIA_MAX_WIDTH;
  }
  if (normalized.startsWith('partner-stores/')) {
    return PARTNER_STORE_MAX_WIDTH;
  }

  return DEFAULT_MAX_WIDTH;
}

async function optimizeSvg(filePath) {
  const before = (await fs.stat(filePath)).size;
  const input = await fs.readFile(filePath, 'utf8');
  const { data } = optimize(input, {
    multipass: true,
    plugins: ['preset-default'],
  });
  await fs.writeFile(filePath, data);
  const after = (await fs.stat(filePath)).size;
  return { before, after, skipped: after >= before };
}

async function writeRasterOutput(pipeline, ext, tempPath) {
  if (ext === '.webp') {
    await pipeline.webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT }).toFile(tempPath);
    return;
  }
  if (ext === '.png') {
    await pipeline
      .png({ compressionLevel: PNG_COMPRESSION, palette: true, quality: 80 })
      .toFile(tempPath);
    return;
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tempPath);
    return;
  }
  if (ext === '.gif') {
    await pipeline.gif().toFile(tempPath);
  }
}

async function replaceFileFromTemp(filePath, tempPath) {
  await fs.copyFile(tempPath, filePath);
}

async function optimizeRaster(filePath, maxWidth) {
  const ext = path.extname(filePath).toLowerCase();
  const before = (await fs.stat(filePath)).size;
  const tempPath = path.join(
    os.tmpdir(),
    `janazyan-opt-${path.basename(filePath)}-${process.pid}.tmp`,
  );

  try {
    const meta = await sharp(filePath).metadata();
    let pipeline = sharp(filePath).rotate();

    if (maxWidth && meta.width && meta.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    await writeRasterOutput(pipeline, ext, tempPath);

    const after = (await fs.stat(tempPath)).size;
    if (after < before) {
      await replaceFileFromTemp(filePath, tempPath);
      return { before, after, skipped: false };
    }

    return { before, after: before, skipped: true };
  } finally {
    await fs.rm(tempPath, { force: true });
  }
}

async function removeStaleTempFiles(files) {
  const removed = [];

  for (const filePath of files) {
    if (!filePath.endsWith('.tmp') && !filePath.endsWith('.opt.tmp')) {
      continue;
    }
    await fs.rm(filePath, { force: true });
    removed.push(path.relative(PUBLIC_ROOT, filePath));
  }

  return removed;
}

async function main() {
  const allFiles = await collectFiles(PUBLIC_ROOT);
  const removedTempFiles = await removeStaleTempFiles(allFiles);
  const svgResults = [];
  const rasterResults = [];

  for (const filePath of allFiles) {
    const relativePath = path.relative(PUBLIC_ROOT, filePath);
    const ext = path.extname(filePath).toLowerCase();

    if (filePath.endsWith('.tmp')) {
      continue;
    }

    if (ext === '.svg') {
      const result = await optimizeSvg(filePath);
      svgResults.push({ file: relativePath, ...result });
      continue;
    }

    if (!RASTER_EXTENSIONS.has(ext)) {
      continue;
    }

    const maxWidth = resolveMaxWidth(relativePath);
    try {
      const result = await optimizeRaster(filePath, maxWidth);
      rasterResults.push({ file: relativePath, maxWidth, ...result });
    } catch (error) {
      rasterResults.push({
        file: relativePath,
        maxWidth,
        before: 0,
        after: 0,
        skipped: true,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const optimizedItems = [...svgResults, ...rasterResults].filter((item) => !item.skipped);
  const totalBefore = optimizedItems.reduce((sum, item) => sum + item.before, 0);
  const totalAfter = optimizedItems.reduce((sum, item) => sum + item.after, 0);

  console.log(
    JSON.stringify(
      {
        removedTempFiles,
        svgCount: svgResults.length,
        rasterCount: rasterResults.length,
        optimizedCount: optimizedItems.length,
        savedBytes: totalBefore - totalAfter,
        totalBefore,
        totalAfter,
        svgResults,
        rasterResults,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
