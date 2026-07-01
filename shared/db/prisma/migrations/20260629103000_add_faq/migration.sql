-- CreateTable
CREATE TABLE "faq_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_category_translations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "faq_category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_items" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_item_translations" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "faq_item_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "faq_categories_slug_key" ON "faq_categories"("slug");

-- CreateIndex
CREATE INDEX "faq_categories_published_idx" ON "faq_categories"("published");

-- CreateIndex
CREATE INDEX "faq_categories_deletedAt_idx" ON "faq_categories"("deletedAt");

-- CreateIndex
CREATE INDEX "faq_categories_position_idx" ON "faq_categories"("position");

-- CreateIndex
CREATE UNIQUE INDEX "faq_category_translations_categoryId_locale_key" ON "faq_category_translations"("categoryId", "locale");

-- CreateIndex
CREATE INDEX "faq_category_translations_locale_idx" ON "faq_category_translations"("locale");

-- CreateIndex
CREATE INDEX "faq_items_categoryId_published_idx" ON "faq_items"("categoryId", "published");

-- CreateIndex
CREATE INDEX "faq_items_deletedAt_idx" ON "faq_items"("deletedAt");

-- CreateIndex
CREATE INDEX "faq_items_position_idx" ON "faq_items"("position");

-- CreateIndex
CREATE UNIQUE INDEX "faq_item_translations_itemId_locale_key" ON "faq_item_translations"("itemId", "locale");

-- CreateIndex
CREATE INDEX "faq_item_translations_locale_idx" ON "faq_item_translations"("locale");

-- AddForeignKey
ALTER TABLE "faq_category_translations" ADD CONSTRAINT "faq_category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "faq_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "faq_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_item_translations" ADD CONSTRAINT "faq_item_translations_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "faq_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
