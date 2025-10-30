-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 10000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cosmetics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "onSale" BOOLEAN NOT NULL DEFAULT false,
    "salePrice" INTEGER,
    "isBundle" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cosmetics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_items" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cosmeticId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isFromBundle" BOOLEAN NOT NULL DEFAULT false,
    "parentPurchaseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "returns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cosmeticId" TEXT NOT NULL,
    "refunded" INTEGER NOT NULL,
    "isBundle" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "itemsProcessed" INTEGER,
    "itemsCreated" INTEGER,
    "itemsUpdated" INTEGER,
    "duration" INTEGER,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_displayName_idx" ON "users"("displayName");

-- CreateIndex
CREATE INDEX "cosmetics_name_idx" ON "cosmetics"("name");

-- CreateIndex
CREATE INDEX "cosmetics_type_idx" ON "cosmetics"("type");

-- CreateIndex
CREATE INDEX "cosmetics_rarity_idx" ON "cosmetics"("rarity");

-- CreateIndex
CREATE INDEX "cosmetics_addedAt_idx" ON "cosmetics"("addedAt" DESC);

-- CreateIndex
CREATE INDEX "cosmetics_isNew_idx" ON "cosmetics"("isNew");

-- CreateIndex
CREATE INDEX "cosmetics_onSale_idx" ON "cosmetics"("onSale");

-- CreateIndex
CREATE INDEX "cosmetics_isBundle_idx" ON "cosmetics"("isBundle");

-- CreateIndex
CREATE INDEX "cosmetics_type_rarity_idx" ON "cosmetics"("type", "rarity");

-- CreateIndex
CREATE INDEX "cosmetics_onSale_salePrice_idx" ON "cosmetics"("onSale", "salePrice");

-- CreateIndex
CREATE INDEX "bundle_items_bundleId_idx" ON "bundle_items"("bundleId");

-- CreateIndex
CREATE INDEX "bundle_items_itemId_idx" ON "bundle_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_items_bundleId_itemId_key" ON "bundle_items"("bundleId", "itemId");

-- CreateIndex
CREATE INDEX "purchases_userId_idx" ON "purchases"("userId");

-- CreateIndex
CREATE INDEX "purchases_cosmeticId_idx" ON "purchases"("cosmeticId");

-- CreateIndex
CREATE INDEX "purchases_createdAt_idx" ON "purchases"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "purchases_parentPurchaseId_idx" ON "purchases"("parentPurchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_userId_cosmeticId_key" ON "purchases"("userId", "cosmeticId");

-- CreateIndex
CREATE INDEX "returns_userId_idx" ON "returns"("userId");

-- CreateIndex
CREATE INDEX "returns_cosmeticId_idx" ON "returns"("cosmeticId");

-- CreateIndex
CREATE INDEX "returns_createdAt_idx" ON "returns"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "returns_userId_createdAt_idx" ON "returns"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "sync_logs_job_idx" ON "sync_logs"("job");

-- CreateIndex
CREATE INDEX "sync_logs_status_idx" ON "sync_logs"("status");

-- CreateIndex
CREATE INDEX "sync_logs_createdAt_idx" ON "sync_logs"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "sync_logs_job_status_createdAt_idx" ON "sync_logs"("job", "status", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_key_key" ON "idempotency_keys"("key");

-- CreateIndex
CREATE INDEX "idempotency_keys_key_idx" ON "idempotency_keys"("key");

-- CreateIndex
CREATE INDEX "idempotency_keys_userId_idx" ON "idempotency_keys"("userId");

-- CreateIndex
CREATE INDEX "idempotency_keys_expiresAt_idx" ON "idempotency_keys"("expiresAt");

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "cosmetics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "cosmetics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_cosmeticId_fkey" FOREIGN KEY ("cosmeticId") REFERENCES "cosmetics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_parentPurchaseId_fkey" FOREIGN KEY ("parentPurchaseId") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_cosmeticId_fkey" FOREIGN KEY ("cosmeticId") REFERENCES "cosmetics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
