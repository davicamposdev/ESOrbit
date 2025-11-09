/*
  Warnings:

  - You are about to drop the column `sale_price` on the `cosmetics` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."cosmetics_on_sale_sale_price_idx";

-- AlterTable
ALTER TABLE "cosmetics" DROP COLUMN "sale_price",
ADD COLUMN     "final_price" INTEGER,
ADD COLUMN     "regular_price" INTEGER;

-- CreateIndex
CREATE INDEX "cosmetics_on_sale_final_price_idx" ON "cosmetics"("on_sale", "final_price");
