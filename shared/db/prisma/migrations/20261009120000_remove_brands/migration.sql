-- Drop product brand foreign key and column
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_brandId_fkey";
DROP INDEX IF EXISTS "products_brandId_idx";
ALTER TABLE "products" DROP COLUMN IF EXISTS "brandId";

-- Drop brand tables
DROP TABLE IF EXISTS "brand_translations";
DROP TABLE IF EXISTS "brands";

-- Remove brand discount settings key (JSON settings store)
DELETE FROM "settings" WHERE "key" = 'brandDiscounts';
