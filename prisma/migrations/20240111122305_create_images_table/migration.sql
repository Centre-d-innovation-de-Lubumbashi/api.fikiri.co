/*
  Warnings:

  - You are about to drop the column `imageLink` on the `Solution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Solution` DROP COLUMN `imageLink`;

-- CreateTable
CREATE TABLE `SolutionImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageLink` VARCHAR(191) NOT NULL,
    `solutionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SolutionImages` ADD CONSTRAINT `SolutionImages_solutionId_fkey` FOREIGN KEY (`solutionId`) REFERENCES `Solution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
