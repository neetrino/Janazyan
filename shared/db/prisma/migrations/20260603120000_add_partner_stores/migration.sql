-- CreateTable
CREATE TABLE "partner_stores" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_store_translations" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logoAlt" TEXT,

    CONSTRAINT "partner_store_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partner_stores_slug_key" ON "partner_stores"("slug");

-- CreateIndex
CREATE INDEX "partner_stores_published_idx" ON "partner_stores"("published");

-- CreateIndex
CREATE INDEX "partner_stores_deletedAt_idx" ON "partner_stores"("deletedAt");

-- CreateIndex
CREATE INDEX "partner_stores_position_idx" ON "partner_stores"("position");

-- CreateIndex
CREATE UNIQUE INDEX "partner_store_translations_storeId_locale_key" ON "partner_store_translations"("storeId", "locale");

-- CreateIndex
CREATE INDEX "partner_store_translations_locale_idx" ON "partner_store_translations"("locale");

-- AddForeignKey
ALTER TABLE "partner_store_translations" ADD CONSTRAINT "partner_store_translations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "partner_stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
