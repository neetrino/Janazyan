-- Partner store hierarchy: Region → optional Area → Store

CREATE TABLE "partner_store_regions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_store_regions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "partner_store_region_translations" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "partner_store_region_translations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "partner_store_areas" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_store_areas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "partner_store_area_translations" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "partner_store_area_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "partner_store_regions_slug_key" ON "partner_store_regions"("slug");
CREATE INDEX "partner_store_regions_published_idx" ON "partner_store_regions"("published");
CREATE INDEX "partner_store_regions_deletedAt_idx" ON "partner_store_regions"("deletedAt");
CREATE INDEX "partner_store_regions_position_idx" ON "partner_store_regions"("position");

CREATE UNIQUE INDEX "partner_store_region_translations_regionId_locale_key" ON "partner_store_region_translations"("regionId", "locale");
CREATE INDEX "partner_store_region_translations_locale_idx" ON "partner_store_region_translations"("locale");

CREATE UNIQUE INDEX "partner_store_areas_regionId_slug_key" ON "partner_store_areas"("regionId", "slug");
CREATE INDEX "partner_store_areas_regionId_idx" ON "partner_store_areas"("regionId");
CREATE INDEX "partner_store_areas_published_idx" ON "partner_store_areas"("published");
CREATE INDEX "partner_store_areas_deletedAt_idx" ON "partner_store_areas"("deletedAt");
CREATE INDEX "partner_store_areas_position_idx" ON "partner_store_areas"("position");

CREATE UNIQUE INDEX "partner_store_area_translations_areaId_locale_key" ON "partner_store_area_translations"("areaId", "locale");
CREATE INDEX "partner_store_area_translations_locale_idx" ON "partner_store_area_translations"("locale");

ALTER TABLE "partner_store_region_translations"
  ADD CONSTRAINT "partner_store_region_translations_regionId_fkey"
  FOREIGN KEY ("regionId") REFERENCES "partner_store_regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "partner_store_areas"
  ADD CONSTRAINT "partner_store_areas_regionId_fkey"
  FOREIGN KEY ("regionId") REFERENCES "partner_store_regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "partner_store_area_translations"
  ADD CONSTRAINT "partner_store_area_translations_areaId_fkey"
  FOREIGN KEY ("areaId") REFERENCES "partner_store_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Attach existing stores to a temporary region so NOT NULL regionId can be applied.
INSERT INTO "partner_store_regions" ("id", "slug", "position", "published", "deletedAt", "createdAt", "updatedAt")
SELECT 'legacy-partner-store-region', 'legacy', 0, true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "partner_stores")
  AND NOT EXISTS (SELECT 1 FROM "partner_store_regions" WHERE "id" = 'legacy-partner-store-region');

INSERT INTO "partner_store_region_translations" ("id", "regionId", "locale", "name")
SELECT 'legacy-partner-store-region-en', 'legacy-partner-store-region', 'en', 'Stores'
WHERE EXISTS (SELECT 1 FROM "partner_store_regions" WHERE "id" = 'legacy-partner-store-region')
  AND NOT EXISTS (
    SELECT 1 FROM "partner_store_region_translations"
    WHERE "id" = 'legacy-partner-store-region-en'
  );

ALTER TABLE "partner_stores" ADD COLUMN "regionId" TEXT;
ALTER TABLE "partner_stores" ADD COLUMN "areaId" TEXT;

UPDATE "partner_stores"
SET "regionId" = 'legacy-partner-store-region'
WHERE "regionId" IS NULL
  AND EXISTS (SELECT 1 FROM "partner_store_regions" WHERE "id" = 'legacy-partner-store-region');

-- If table is empty, still require regionId going forward via a placeholder-safe cast.
-- When no rows exist, ADD NOT NULL succeeds without a default once column is nullable then altered.
DELETE FROM "partner_stores" WHERE "regionId" IS NULL;

ALTER TABLE "partner_stores" ALTER COLUMN "regionId" SET NOT NULL;

CREATE INDEX "partner_stores_regionId_idx" ON "partner_stores"("regionId");
CREATE INDEX "partner_stores_areaId_idx" ON "partner_stores"("areaId");

ALTER TABLE "partner_stores"
  ADD CONSTRAINT "partner_stores_regionId_fkey"
  FOREIGN KEY ("regionId") REFERENCES "partner_store_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "partner_stores"
  ADD CONSTRAINT "partner_stores_areaId_fkey"
  FOREIGN KEY ("areaId") REFERENCES "partner_store_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
