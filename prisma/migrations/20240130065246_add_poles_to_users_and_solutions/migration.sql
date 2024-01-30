/*
  Warnings:

  - You are about to drop the column `pole` on the `Solution` table. All the data in the column will be lost.
  - You are about to drop the column `pole` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Solution` DROP COLUMN `pole`,
    ADD COLUMN `poleId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `pole`,
    ADD COLUMN `poleId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Pole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Pole_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_poleId_fkey` FOREIGN KEY (`poleId`) REFERENCES `Pole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solution` ADD CONSTRAINT `Solution_poleId_fkey` FOREIGN KEY (`poleId`) REFERENCES `Pole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
