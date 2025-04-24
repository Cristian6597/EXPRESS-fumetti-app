/*
  Warnings:

  - You are about to drop the column `listId` on the `fumetteria` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `fumetteria` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fumetteria` DROP COLUMN `listId`,
    DROP COLUMN `updatedAt`;
