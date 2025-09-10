/*
  Warnings:

  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `shops` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."USER_ROLE" AS ENUM ('ADMIN', 'SELLER', 'CUSTOMER', 'GUEST');

-- CreateEnum
CREATE TYPE "public"."SORT_ATTRIBUTES" AS ENUM ('NAME', 'CREATED_AT');

-- CreateEnum
CREATE TYPE "public"."SORT_ORDERS" AS ENUM ('ASC', 'DESC');

-- CreateEnum
CREATE TYPE "public"."ORDER_STATUS" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SHOP_STATUS" AS ENUM ('ACTIVE', 'REJECTED', 'PENDING_VERIFICATION', 'CLOSED', 'BANNED');

-- CreateEnum
CREATE TYPE "public"."USER_STATUS" AS ENUM ('ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "public"."PAYMENT_STATUS" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."PAYMENT_METHOD" AS ENUM ('MOMO', 'COD', 'BANK_TRANSFER', 'PAYPAL');

-- CreateEnum
CREATE TYPE "public"."PRODUCT_STATUS" AS ENUM ('PENDING', 'REJECTED', 'ACTIVE', 'INACTIVE', 'BANNED');

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ORDER_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ORDER_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PRODUCT_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."shops" DROP COLUMN "status",
ADD COLUMN     "status" "public"."SHOP_STATUS" NOT NULL DEFAULT 'PENDING_VERIFICATION';

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "role",
ADD COLUMN     "role" "public"."USER_ROLE" NOT NULL DEFAULT 'CUSTOMER',
DROP COLUMN "status",
ADD COLUMN     "status" "public"."USER_STATUS" NOT NULL DEFAULT 'ACTIVE';
