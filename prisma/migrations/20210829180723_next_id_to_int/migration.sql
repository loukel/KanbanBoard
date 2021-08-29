/*
  Warnings:

  - The `nextId` column on the `Column` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `nextId` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Column" DROP COLUMN "nextId",
ADD COLUMN     "nextId" INTEGER;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "nextId",
ADD COLUMN     "nextId" INTEGER;
