/*
  Warnings:

  - Added the required column `description` to the `bundle_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."bundle_items" DROP CONSTRAINT "bundle_items_bundle_id_fkey";

-- AlterTable
ALTER TABLE "bundle_items" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "bundles" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bundles_external_id_key" ON "bundles"("external_id");

-- CreateIndex
CREATE INDEX "bundles_name_idx" ON "bundles"("name");

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
