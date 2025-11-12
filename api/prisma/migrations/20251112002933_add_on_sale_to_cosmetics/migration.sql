-- AlterTable
ALTER TABLE "cosmetics" ADD COLUMN     "on_sale" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "cosmetics_on_sale_idx" ON "cosmetics"("on_sale");
