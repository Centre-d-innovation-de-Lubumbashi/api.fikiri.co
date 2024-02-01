-- DropForeignKey
ALTER TABLE `Solution` DROP FOREIGN KEY `Solution_callId_fkey`;

-- DropForeignKey
ALTER TABLE `Solution` DROP FOREIGN KEY `Solution_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `Solution` DROP FOREIGN KEY `Solution_thematicId_fkey`;

-- AlterTable
ALTER TABLE `Solution` MODIFY `name` TEXT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `callId` INTEGER NULL,
    MODIFY `thematicId` INTEGER NULL,
    MODIFY `targetedProblem` TEXT NULL,
    MODIFY `statusId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Solution` ADD CONSTRAINT `Solution_callId_fkey` FOREIGN KEY (`callId`) REFERENCES `Call`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solution` ADD CONSTRAINT `Solution_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solution` ADD CONSTRAINT `Solution_thematicId_fkey` FOREIGN KEY (`thematicId`) REFERENCES `Thematic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
