-- CreateTable
CREATE TABLE `_FeedbackToLabel` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FeedbackToLabel_AB_unique`(`A`, `B`),
    INDEX `_FeedbackToLabel_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FeedbackToLabel` ADD CONSTRAINT `_FeedbackToLabel_A_fkey` FOREIGN KEY (`A`) REFERENCES `Feedback`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FeedbackToLabel` ADD CONSTRAINT `_FeedbackToLabel_B_fkey` FOREIGN KEY (`B`) REFERENCES `Label`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
