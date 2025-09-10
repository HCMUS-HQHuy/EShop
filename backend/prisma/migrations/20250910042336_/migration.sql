/*
  Warnings:

  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `iconname` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `OrderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderItemId` on the `OrderItems` table. All the data in the column will be lost.
  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderId` on the `Orders` table. All the data in the column will be lost.
  - The primary key for the `PaymentMethods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `paymentMethodId` on the `PaymentMethods` table. All the data in the column will be lost.
  - The primary key for the `ProductImages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageId` on the `ProductImages` table. All the data in the column will be lost.
  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `Products` table. All the data in the column will be lost.
  - The primary key for the `Shops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopId` on the `Shops` table. All the data in the column will be lost.
  - The primary key for the `Tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tokenId` on the `Tokens` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Categories" DROP CONSTRAINT "Categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Categories" DROP CONSTRAINT "fk_category_deletedBy";

-- DropForeignKey
ALTER TABLE "public"."Conversations" DROP CONSTRAINT "Conversations_participant1Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Conversations" DROP CONSTRAINT "Conversations_participant2Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Messages" DROP CONSTRAINT "Messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItems" DROP CONSTRAINT "fk_order_item_order";

-- DropForeignKey
ALTER TABLE "public"."OrderItems" DROP CONSTRAINT "fk_order_item_product";

-- DropForeignKey
ALTER TABLE "public"."Orders" DROP CONSTRAINT "fk_order_shop";

-- DropForeignKey
ALTER TABLE "public"."Orders" DROP CONSTRAINT "fk_order_user";

-- DropForeignKey
ALTER TABLE "public"."Payments" DROP CONSTRAINT "fk_payment_order";

-- DropForeignKey
ALTER TABLE "public"."ProductCategories" DROP CONSTRAINT "ProductCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductCategories" DROP CONSTRAINT "ProductCategories_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImages" DROP CONSTRAINT "fk_image_deletedBy";

-- DropForeignKey
ALTER TABLE "public"."ProductImages" DROP CONSTRAINT "fk_image_product";

-- DropForeignKey
ALTER TABLE "public"."Products" DROP CONSTRAINT "fk_product_deletedBy";

-- DropForeignKey
ALTER TABLE "public"."Products" DROP CONSTRAINT "fk_product_shop";

-- DropForeignKey
ALTER TABLE "public"."Shops" DROP CONSTRAINT "fk_shop_user";

-- DropForeignKey
ALTER TABLE "public"."Tokens" DROP CONSTRAINT "fk_token_user";

-- AlterTable
ALTER TABLE "public"."Categories" DROP CONSTRAINT "Categories_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "iconname",
ADD COLUMN     "iconName" VARCHAR(100),
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."OrderItems" DROP CONSTRAINT "OrderItems_pkey",
DROP COLUMN "orderItemId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Orders" DROP CONSTRAINT "Orders_pkey",
DROP COLUMN "orderId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."PaymentMethods" DROP CONSTRAINT "PaymentMethods_pkey",
DROP COLUMN "paymentMethodId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ProductImages" DROP CONSTRAINT "ProductImages_pkey",
DROP COLUMN "imageId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProductImages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Products" DROP CONSTRAINT "Products_pkey",
DROP COLUMN "productId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Shops" DROP CONSTRAINT "Shops_pkey",
DROP COLUMN "shopId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Shops_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Tokens" DROP CONSTRAINT "Tokens_pkey",
DROP COLUMN "tokenId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Categories" ADD CONSTRAINT "fk_category_deletedBy" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Conversations" ADD CONSTRAINT "Conversations_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Conversations" ADD CONSTRAINT "Conversations_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."OrderItems" ADD CONSTRAINT "fk_order_item_order" FOREIGN KEY ("orderId") REFERENCES "public"."Orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."OrderItems" ADD CONSTRAINT "fk_order_item_product" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "fk_order_shop" FOREIGN KEY ("shopId") REFERENCES "public"."Shops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "fk_order_user" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "fk_payment_order" FOREIGN KEY ("orderId") REFERENCES "public"."Orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductCategories" ADD CONSTRAINT "ProductCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductCategories" ADD CONSTRAINT "ProductCategories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductImages" ADD CONSTRAINT "fk_image_deletedBy" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductImages" ADD CONSTRAINT "fk_image_product" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "fk_product_deletedBy" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "fk_product_shop" FOREIGN KEY ("shopId") REFERENCES "public"."Shops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Shops" ADD CONSTRAINT "fk_shop_user" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Tokens" ADD CONSTRAINT "fk_token_user" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
