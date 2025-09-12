/*
  Warnings:

  - Made the column `isRead` on table `Messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Messages" ALTER COLUMN "isRead" SET NOT NULL;
