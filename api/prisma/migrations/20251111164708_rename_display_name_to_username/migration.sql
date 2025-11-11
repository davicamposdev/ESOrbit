/*
  Warnings:

  - You are about to drop the column `display_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_display_name_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "display_name",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");
