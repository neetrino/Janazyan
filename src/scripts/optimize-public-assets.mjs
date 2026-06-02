import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const PUBLIC_FIGMA = path.resolve('public/figma');

/** Max width per asset; height scales proportionally. */
const RASTER_TARGETS = {
  'about-hero.png': 1024,
  'category-body.png': 900,
  'category-face.png': 900,
  'category-hair.png': 900,
  'category-kids.png': 900,
  'featured-product.png': 768,
  'footer-decoration.png': 900,
  'footer-logo.png': 512,
  'header-logo.png': 512,
  'promo-cosmetic.png': 900,
  'promo-poster-photo.png': 1280,
};

const REMOVE_FILES = [
  'bottle.png',
  'cart-icon.png',
  'cosmetic-hero.png',
  'hero-bg.png',
  'hero-product.png',
  'product.png',
  'star-icon.png',
];

async function optimizeSvg(filePath) {
  const input = await fs.readFile(filePath, 'utf8');
  const { data } = optimize(input, {
    multipass: true,
    plugins: ['preset-default'],
  });
  await fs.writeFile(filePath, data);
}

async function convertPngToWebp(fileName, maxWidth) {
  const inputPath = path.join(PUBLIC_FIGMA, fileName);
  const outputName = fileName.replace(/\.png$/i, '.webp');
  const outputPath = path.join(PUBLIC_FIGMA, outputName);

  await sharp(inputPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(outputPath);

  const before = (await fs.stat(inputPath)).size;
  const after = (await fs.stat(outputPath)).size;
  return { fileName, outputName, before, after };
}

async function main() {
  const entries = await fs.readdir(PUBLIC_FIGMA);
  const svgResults = [];

  for (const file of entries.filter((name) => name.endsWith('.svg'))) {
    const filePath = path.join(PUBLIC_FIGMA, file);
    const before = (await fs.stat(filePath)).size;
    await optimizeSvg(filePath);
    const after = (await fs.stat(filePath)).size;
    svgResults.push({ file, before, after });
  }

  const rasterResults = [];
  for (const [fileName, maxWidth] of Object.entries(RASTER_TARGETS)) {
    rasterResults.push(await convertPngToWebp(fileName, maxWidth));
  }

  for (const fileName of REMOVE_FILES) {
    await fs.rm(path.join(PUBLIC_FIGMA, fileName), { force: true });
  }

  for (const fileName of Object.keys(RASTER_TARGETS)) {
    await fs.rm(path.join(PUBLIC_FIGMA, fileName), { force: true });
  }

  const totalBefore = [...svgResults, ...rasterResults].reduce(
    (sum, item) => sum + item.before,
    0,
  );
  const totalAfter = [...svgResults, ...rasterResults].reduce(
    (sum, item) => sum + item.after,
    0,
  );

  console.log(JSON.stringify({ svgResults, rasterResults, totalBefore, totalAfter }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
