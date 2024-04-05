/*
  Warnings:

  - You are about to drop the column `order` on the `Genre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "order",
ADD COLUMN     "orderNumber" INTEGER NOT NULL DEFAULT 0;
