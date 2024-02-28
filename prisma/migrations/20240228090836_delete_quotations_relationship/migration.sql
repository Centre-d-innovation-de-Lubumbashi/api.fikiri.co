/*
  Warnings:

  - You are about to drop the `_FeedbackToQuotation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quotations` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_FeedbackToQuotation` DROP FOREIGN KEY `_FeedbackToQuotation_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FeedbackToQuotation` DROP FOREIGN KEY `_FeedbackToQuotation_B_fkey`;

-- AlterTable
ALTER TABLE `Feedback` ADD COLUMN `quotations` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_FeedbackToQuotation`;
