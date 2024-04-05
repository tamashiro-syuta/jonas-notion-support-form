/*
  Warnings:

  - A unique constraint covering the columns `[databaseId]` on the table `NotionDB` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[databaseName]` on the table `NotionDB` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `databaseName` to the `NotionDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayDatabaseName` to the `NotionDB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotionDB" ADD COLUMN     "databaseName" TEXT NOT NULL,
ADD COLUMN     "displayDatabaseName" TEXT NOT NULL,
ALTER COLUMN "databaseId" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "NotionDB_databaseId_key" ON "NotionDB"("databaseId");

-- CreateIndex
CREATE UNIQUE INDEX "NotionDB_databaseName_key" ON "NotionDB"("databaseName");
