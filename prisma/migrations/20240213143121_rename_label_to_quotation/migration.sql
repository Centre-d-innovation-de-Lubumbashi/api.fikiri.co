/*
  Warnings:

  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FeedbackToLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_FeedbackToLabel` DROP FOREIGN KEY `_FeedbackToLabel_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FeedbackToLabel` DROP FOREIGN KEY `_FeedbackToLabel_B_fkey`;

-- AlterTable
ALTER TABLE `Feedback` MODIFY `adminComment` VARCHAR(191) NULL,
    MODIFY `userComment` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Label`;

-- DropTable
DROP TABLE `_FeedbackToLabel`;

-- CreateTable
CREATE TABLE `Quotation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `average` DOUBLE NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Quotation_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FeedbackToQuotation` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FeedbackToQuotation_AB_unique`(`A`, `B`),
    INDEX `_FeedbackToQuotation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FeedbackToQuotation` ADD CONSTRAINT `_FeedbackToQuotation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Feedback`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FeedbackToQuotation` ADD CONSTRAINT `_FeedbackToQuotation_B_fkey` FOREIGN KEY (`B`) REFERENCES `Quotation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
