/*
  Warnings:

  - You are about to drop the column `bundleId` on the `bundle_items` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `bundle_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `bundle_items` table. All the data in the column will be lost.
  - You are about to drop the column `addedAt` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `isBundle` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `onSale` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cosmetics` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `idempotency_keys` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `idempotency_keys` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `idempotency_keys` table. All the data in the column will be lost.
  - You are about to drop the column `cosmeticId` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `isFromBundle` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `parentPurchaseId` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `cosmeticId` on the `returns` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `returns` table. All the data in the column will be lost.
  - You are about to drop the column `isBundle` on the `returns` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `returns` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `finishedAt` on the `sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `itemsCreated` on the `sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `itemsProcessed` on the `sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `itemsUpdated` on the `sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bundle_id,item_id]` on the table `bundle_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `cosmetics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,cosmetic_id]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bundle_id` to the `bundle_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `bundle_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `added_at` to the `cosmetics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `cosmetics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `cosmetics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `cosmetics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `idempotency_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `idempotency_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cosmetic_id` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cosmetic_id` to the `returns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `returns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."bundle_items" DROP CONSTRAINT "bundle_items_bundleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."bundle_items" DROP CONSTRAINT "bundle_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."purchases" DROP CONSTRAINT "purchases_cosmeticId_fkey";

-- DropForeignKey
ALTER TABLE "public"."purchases" DROP CONSTRAINT "purchases_parentPurchaseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."purchases" DROP CONSTRAINT "purchases_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."returns" DROP CONSTRAINT "returns_cosmeticId_fkey";

-- DropForeignKey
ALTER TABLE "public"."returns" DROP CONSTRAINT "returns_userId_fkey";

-- DropIndex
DROP INDEX "public"."bundle_items_bundleId_idx";

-- DropIndex
DROP INDEX "public"."bundle_items_bundleId_itemId_key";

-- DropIndex
DROP INDEX "public"."bundle_items_itemId_idx";

-- DropIndex
DROP INDEX "public"."cosmetics_addedAt_idx";

-- DropIndex
DROP INDEX "public"."cosmetics_isBundle_idx";

-- DropIndex
DROP INDEX "public"."cosmetics_isNew_idx";

-- DropIndex
DROP INDEX "public"."cosmetics_onSale_idx";

-- DropIndex
DROP INDEX "public"."cosmetics_onSale_salePrice_idx";

-- DropIndex
DROP INDEX "public"."idempotency_keys_expiresAt_idx";

-- DropIndex
DROP INDEX "public"."idempotency_keys_userId_idx";

-- DropIndex
DROP INDEX "public"."purchases_cosmeticId_idx";

-- DropIndex
DROP INDEX "public"."purchases_createdAt_idx";

-- DropIndex
DROP INDEX "public"."purchases_parentPurchaseId_idx";

-- DropIndex
DROP INDEX "public"."purchases_userId_cosmeticId_key";

-- DropIndex
DROP INDEX "public"."purchases_userId_idx";

-- DropIndex
DROP INDEX "public"."returns_cosmeticId_idx";

-- DropIndex
DROP INDEX "public"."returns_createdAt_idx";

-- DropIndex
DROP INDEX "public"."returns_userId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."returns_userId_idx";

-- DropIndex
DROP INDEX "public"."sync_logs_createdAt_idx";

-- DropIndex
DROP INDEX "public"."sync_logs_job_status_createdAt_idx";

-- DropIndex
DROP INDEX "public"."users_displayName_idx";

-- AlterTable
ALTER TABLE "bundle_items" DROP COLUMN "bundleId",
DROP COLUMN "createdAt",
DROP COLUMN "itemId",
ADD COLUMN     "bundle_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cosmetics" DROP COLUMN "addedAt",
DROP COLUMN "createdAt",
DROP COLUMN "imageUrl",
DROP COLUMN "isBundle",
DROP COLUMN "isNew",
DROP COLUMN "onSale",
DROP COLUMN "salePrice",
DROP COLUMN "updatedAt",
ADD COLUMN     "added_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "is_bundle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_new" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "on_sale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sale_price" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "idempotency_keys" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "cosmeticId",
DROP COLUMN "createdAt",
DROP COLUMN "isFromBundle",
DROP COLUMN "parentPurchaseId",
DROP COLUMN "userId",
ADD COLUMN     "cosmetic_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_from_bundle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_purchase_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "returns" DROP COLUMN "cosmeticId",
DROP COLUMN "createdAt",
DROP COLUMN "isBundle",
DROP COLUMN "userId",
ADD COLUMN     "cosmetic_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_bundle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sync_logs" DROP COLUMN "createdAt",
DROP COLUMN "finishedAt",
DROP COLUMN "itemsCreated",
DROP COLUMN "itemsProcessed",
DROP COLUMN "itemsUpdated",
DROP COLUMN "startedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "finished_at" TIMESTAMP(3),
ADD COLUMN     "items_created" INTEGER,
ADD COLUMN     "items_processed" INTEGER,
ADD COLUMN     "items_updated" INTEGER,
ADD COLUMN     "started_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "displayName",
DROP COLUMN "passwordHash",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "bundle_items_bundle_id_idx" ON "bundle_items"("bundle_id");

-- CreateIndex
CREATE INDEX "bundle_items_item_id_idx" ON "bundle_items"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_items_bundle_id_item_id_key" ON "bundle_items"("bundle_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "cosmetics_external_id_key" ON "cosmetics"("external_id");

-- CreateIndex
CREATE INDEX "cosmetics_added_at_idx" ON "cosmetics"("added_at" DESC);

-- CreateIndex
CREATE INDEX "cosmetics_is_new_idx" ON "cosmetics"("is_new");

-- CreateIndex
CREATE INDEX "cosmetics_on_sale_idx" ON "cosmetics"("on_sale");

-- CreateIndex
CREATE INDEX "cosmetics_is_bundle_idx" ON "cosmetics"("is_bundle");

-- CreateIndex
CREATE INDEX "cosmetics_on_sale_sale_price_idx" ON "cosmetics"("on_sale", "sale_price");

-- CreateIndex
CREATE INDEX "cosmetics_external_id_idx" ON "cosmetics"("external_id");

-- CreateIndex
CREATE INDEX "idempotency_keys_user_id_idx" ON "idempotency_keys"("user_id");

-- CreateIndex
CREATE INDEX "idempotency_keys_expires_at_idx" ON "idempotency_keys"("expires_at");

-- CreateIndex
CREATE INDEX "purchases_user_id_idx" ON "purchases"("user_id");

-- CreateIndex
CREATE INDEX "purchases_cosmetic_id_idx" ON "purchases"("cosmetic_id");

-- CreateIndex
CREATE INDEX "purchases_created_at_idx" ON "purchases"("created_at" DESC);

-- CreateIndex
CREATE INDEX "purchases_parent_purchase_id_idx" ON "purchases"("parent_purchase_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_user_id_cosmetic_id_key" ON "purchases"("user_id", "cosmetic_id");

-- CreateIndex
CREATE INDEX "returns_user_id_idx" ON "returns"("user_id");

-- CreateIndex
CREATE INDEX "returns_cosmetic_id_idx" ON "returns"("cosmetic_id");

-- CreateIndex
CREATE INDEX "returns_created_at_idx" ON "returns"("created_at" DESC);

-- CreateIndex
CREATE INDEX "returns_user_id_created_at_idx" ON "returns"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "sync_logs_created_at_idx" ON "sync_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "sync_logs_job_status_created_at_idx" ON "sync_logs"("job", "status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "users_display_name_idx" ON "users"("display_name");

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "cosmetics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "cosmetics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_cosmetic_id_fkey" FOREIGN KEY ("cosmetic_id") REFERENCES "cosmetics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_parent_purchase_id_fkey" FOREIGN KEY ("parent_purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_cosmetic_id_fkey" FOREIGN KEY ("cosmetic_id") REFERENCES "cosmetics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
