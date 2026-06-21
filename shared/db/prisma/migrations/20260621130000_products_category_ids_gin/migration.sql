-- Speed up category filter: products.categoryIds @> ARRAY[id]
CREATE INDEX IF NOT EXISTS "products_category_ids_gin_idx"
ON "products" USING GIN ("categoryIds");
