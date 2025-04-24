/*
  Warnings:

  - You are about to drop the column `nome` on the `fumetteria` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `fumetti` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Fumetti` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Fumetteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Fumetti` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Fumetti_name_key` ON `fumetti`;

-- AlterTable
ALTER TABLE `fumetteria` DROP COLUMN `nome`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `fumetti` DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Fumetti_title_key` ON `Fumetti`(`title`);
