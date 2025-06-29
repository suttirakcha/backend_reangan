/*
  Warnings:

  - You are about to drop the `Questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Statistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Questions` DROP FOREIGN KEY `Questions_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `Statistics` DROP FOREIGN KEY `Statistics_user_id_fkey`;

-- DropTable
DROP TABLE `Questions`;

-- DropTable
DROP TABLE `Statistics`;

-- CreateTable
CREATE TABLE `statistics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `correct_answered` INTEGER NOT NULL,
    `incorrect_answered` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(191) NOT NULL,
    `correct_answer` VARCHAR(191) NOT NULL,
    `lesson_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `statistics` ADD CONSTRAINT `statistics_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
