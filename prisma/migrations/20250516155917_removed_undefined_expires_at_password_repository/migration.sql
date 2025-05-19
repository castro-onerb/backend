/*
  Warnings:

  - Made the column `expires_at` on table `passwords_recoveries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "passwords_recoveries" ALTER COLUMN "expires_at" SET NOT NULL;
