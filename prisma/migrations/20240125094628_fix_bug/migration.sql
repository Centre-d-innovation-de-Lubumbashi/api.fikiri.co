/*
  Warnings:

  - You are about to drop the column `googleImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SolutionImages` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `createdAt` on table `Call` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Call` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Solution` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Solution` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Thematic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Thematic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `SolutionImages` DROP FOREIGN KEY `SolutionImages_solutionId_fkey`;

-- AlterTable
ALTER TABLE `Call` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Challenge` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Role` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Solution` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Status` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Thematic` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `googleImage`,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `SolutionImages`;
