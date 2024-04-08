/*
  Warnings:

  - You are about to drop the column `isDefault` on the `NotionDB` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `NotionDB` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "HouseholdType" AS ENUM ('INDIVIDUAL', 'PAIRS');

-- DropForeignKey
ALTER TABLE "NotionDB" DROP CONSTRAINT "NotionDB_userId_fkey";

-- AlterTable
ALTER TABLE "NotionDB" DROP COLUMN "isDefault",
DROP COLUMN "userId",
ADD COLUMN     "household" "HouseholdType" NOT NULL DEFAULT 'INDIVIDUAL';

-- DropTable
DROP TABLE "User";
