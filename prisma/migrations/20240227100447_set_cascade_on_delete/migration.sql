-- DropForeignKey
ALTER TABLE `SolutionImages` DROP FOREIGN KEY `SolutionImages_solutionId_fkey`;

-- AddForeignKey
ALTER TABLE `SolutionImages` ADD CONSTRAINT `SolutionImages_solutionId_fkey` FOREIGN KEY (`solutionId`) REFERENCES `Solution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
