/*
  Warnings:

  - You are about to drop the `bundle_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."bundle_items" DROP CONSTRAINT "bundle_items_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."bundle_items" DROP CONSTRAINT "bundle_items_item_id_fkey";

-- DropTable
DROP TABLE "public"."bundle_items";

-- CreateTable
CREATE TABLE "bundle_cosmetics" (
    "id" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "cosmetic_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_cosmetics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bundle_cosmetics_bundle_id_idx" ON "bundle_cosmetics"("bundle_id");

-- CreateIndex
CREATE INDEX "bundle_cosmetics_cosmetic_id_idx" ON "bundle_cosmetics"("cosmetic_id");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_cosmetics_bundle_id_cosmetic_id_key" ON "bundle_cosmetics"("bundle_id", "cosmetic_id");

-- AddForeignKey
ALTER TABLE "bundle_cosmetics" ADD CONSTRAINT "bundle_cosmetics_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_cosmetics" ADD CONSTRAINT "bundle_cosmetics_cosmetic_id_fkey" FOREIGN KEY ("cosmetic_id") REFERENCES "cosmetics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
