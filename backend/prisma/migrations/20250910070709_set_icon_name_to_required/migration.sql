/*
  Warnings:

  - Made the column `iconName` on table `Categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Categories" ALTER COLUMN "iconName" SET NOT NULL;
