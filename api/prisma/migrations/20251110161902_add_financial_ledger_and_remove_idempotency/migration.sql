/*
  Warnings:

  - You are about to drop the column `price` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `is_bundle` on the `returns` table. All the data in the column will be lost.
  - You are about to drop the column `refunded` on the `returns` table. All the data in the column will be lost.
  - You are about to drop the `idempotency_keys` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transaction_id]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_id]` on the table `returns` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_id` to the `returns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `returns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `returns` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('purchase', 'refund', 'transfer', 'bonus', 'adjustment');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('active', 'returned', 'cancelled');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('pending', 'completed', 'failed');

-- DropIndex
DROP INDEX "public"."purchases_created_at_idx";

-- DropIndex
DROP INDEX "public"."purchases_parent_purchase_id_idx";

-- DropIndex
DROP INDEX "public"."returns_cosmetic_id_idx";

-- DropIndex
DROP INDEX "public"."returns_created_at_idx";

-- DropIndex
DROP INDEX "public"."returns_user_id_created_at_idx";

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "price",
ADD COLUMN     "returned_at" TIMESTAMP(3),
ADD COLUMN     "status" "PurchaseStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "transaction_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "returns" DROP COLUMN "is_bundle",
DROP COLUMN "refunded",
ADD COLUMN     "is_partial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "purchase_id" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "status" "ReturnStatus" NOT NULL DEFAULT 'completed',
ADD COLUMN     "transaction_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."idempotency_keys";

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "from_transaction_id" TEXT NOT NULL,
    "to_transaction_id" TEXT NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'completed',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transfers_from_transaction_id_key" ON "transfers"("from_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "transfers_to_transaction_id_key" ON "transfers"("to_transaction_id");

-- CreateIndex
CREATE INDEX "transfers_from_user_id_idx" ON "transfers"("from_user_id");

-- CreateIndex
CREATE INDEX "transfers_to_user_id_idx" ON "transfers"("to_user_id");

-- CreateIndex
CREATE INDEX "transfers_status_idx" ON "transfers"("status");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_created_at_idx" ON "transactions"("created_at" DESC);

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_transaction_id_key" ON "purchases"("transaction_id");

-- CreateIndex
CREATE INDEX "purchases_status_idx" ON "purchases"("status");

-- CreateIndex
CREATE INDEX "purchases_transaction_id_idx" ON "purchases"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "returns_transaction_id_key" ON "returns"("transaction_id");

-- CreateIndex
CREATE INDEX "returns_purchase_id_idx" ON "returns"("purchase_id");

-- CreateIndex
CREATE INDEX "returns_status_idx" ON "returns"("status");

-- CreateIndex
CREATE INDEX "returns_transaction_id_idx" ON "returns"("transaction_id");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
