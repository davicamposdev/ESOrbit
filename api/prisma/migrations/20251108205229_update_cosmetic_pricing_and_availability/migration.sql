/*
  Warnings:

  - You are about to drop the column `final_price` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `on_sale` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `regular_price` on the `cosmetics` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."cosmetics_on_sale_final_price_idx";

-- DropIndex
DROP INDEX "public"."cosmetics_on_sale_idx";

-- AlterTable
ALTER TABLE "cosmetics" DROP COLUMN "final_price",
DROP COLUMN "on_sale",
DROP COLUMN "regular_price",
ADD COLUMN     "base_price" INTEGER,
ADD COLUMN     "current_price" INTEGER,
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "cosmetics_is_available_idx" ON "cosmetics"("is_available");

-- CreateIndex
CREATE INDEX "cosmetics_is_available_current_price_idx" ON "cosmetics"("is_available", "current_price");
