/*
  Warnings:

  - The `status` column on the `Payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Payments" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING';
