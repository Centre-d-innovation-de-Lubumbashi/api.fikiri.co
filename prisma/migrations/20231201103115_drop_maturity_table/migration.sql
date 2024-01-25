/*
  Warnings:

  - You are about to drop the column `maturityId` on the `Solution` table. All the data in the column will be lost.
  - You are about to drop the `Maturity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Solution` DROP FOREIGN KEY `Solution_maturityId_fkey`;

-- AlterTable
ALTER TABLE `Solution` DROP COLUMN `maturityId`;

-- DropTable
DROP TABLE `Maturity`;
