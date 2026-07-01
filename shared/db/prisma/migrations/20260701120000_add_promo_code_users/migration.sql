-- CreateTable
CREATE TABLE "promo_code_users" (
    "promoCodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_code_users_pkey" PRIMARY KEY ("promoCodeId","userId")
);

-- CreateIndex
CREATE INDEX "promo_code_users_userId_idx" ON "promo_code_users"("userId");

-- AddForeignKey
ALTER TABLE "promo_code_users" ADD CONSTRAINT "promo_code_users_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "promo_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_code_users" ADD CONSTRAINT "promo_code_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
