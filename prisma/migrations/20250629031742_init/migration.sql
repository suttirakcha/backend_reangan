/*
  Warnings:

  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `lessons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `statistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `lessons` DROP FOREIGN KEY `lessons_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `questions_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `statistics` DROP FOREIGN KEY `statistics_user_id_fkey`;

-- DropIndex
DROP INDEX `lessons_course_id_fkey` ON `lessons`;

-- DropIndex
DROP INDEX `questions_lesson_id_fkey` ON `questions`;

-- DropIndex
DROP INDEX `statistics_user_id_fkey` ON `statistics`;

-- AlterTable
ALTER TABLE `courses` DROP PRIMARY KEY,
    ADD COLUMN `description` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `lessons` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `course_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `questions` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `lesson_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `statistics` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `statistics` ADD CONSTRAINT `statistics_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
