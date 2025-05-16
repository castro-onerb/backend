/*
  Warnings:

  - Added the required column `user_id` to the `passwords_recoveries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passwords_recoveries" ADD COLUMN     "user_id" TEXT NOT NULL;
