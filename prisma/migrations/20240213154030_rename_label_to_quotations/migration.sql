/*
  Warnings:

  - You are about to drop the column `name` on the `Quotation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mention]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mention` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Quotation_name_key` ON `Quotation`;

-- AlterTable
ALTER TABLE `Quotation` DROP COLUMN `name`,
    ADD COLUMN `mention` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Quotation_mention_key` ON `Quotation`(`mention`);
