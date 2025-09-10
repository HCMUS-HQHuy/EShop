/*
  Warnings:

  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `Conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Conversations` table. All the data in the column will be lost.
  - The primary key for the `Messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Messages` table. All the data in the column will be lost.
  - The primary key for the `OrderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderItems` table. All the data in the column will be lost.
  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Orders` table. All the data in the column will be lost.
  - The primary key for the `PaymentMethods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PaymentMethods` table. All the data in the column will be lost.
  - The primary key for the `ProductImages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductImages` table. All the data in the column will be lost.
  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Products` table. All the data in the column will be lost.
  - The primary key for the `Shops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Shops` table. All the data in the column will be lost.
  - The primary key for the `Tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Tokens` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Users` table. All the data in the column will be lost.

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
ALTER TABLE "public"."Messages" DROP CONSTRAINT "Messages_conversationId_fkey";

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
DROP COLUMN "id",
ADD COLUMN     "categoryId" SERIAL NOT NULL,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId");

-- AlterTable
ALTER TABLE "public"."Conversations" DROP CONSTRAINT "Conversations_pkey",
DROP COLUMN "id",
ADD COLUMN     "conversationId" SERIAL NOT NULL,
ADD CONSTRAINT "Conversations_pkey" PRIMARY KEY ("conversationId");

-- AlterTable
ALTER TABLE "public"."Messages" DROP CONSTRAINT "Messages_pkey",
DROP COLUMN "id",
ADD COLUMN     "messageId" SERIAL NOT NULL,
ADD CONSTRAINT "Messages_pkey" PRIMARY KEY ("messageId");

-- AlterTable
ALTER TABLE "public"."OrderItems" DROP CONSTRAINT "OrderItems_pkey",
DROP COLUMN "id",
ADD COLUMN     "orderItemId" SERIAL NOT NULL,
ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("orderItemId");

-- AlterTable
ALTER TABLE "public"."Orders" DROP CONSTRAINT "Orders_pkey",
DROP COLUMN "id",
ADD COLUMN     "orderId" SERIAL NOT NULL,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId");

-- AlterTable
ALTER TABLE "public"."PaymentMethods" DROP CONSTRAINT "PaymentMethods_pkey",
DROP COLUMN "id",
ADD COLUMN     "paymentMethodId" SERIAL NOT NULL,
ADD CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("paymentMethodId");

-- AlterTable
ALTER TABLE "public"."ProductImages" DROP CONSTRAINT "ProductImages_pkey",
DROP COLUMN "id",
ADD COLUMN     "imageId" SERIAL NOT NULL,
ADD CONSTRAINT "ProductImages_pkey" PRIMARY KEY ("imageId");

-- AlterTable
ALTER TABLE "public"."Products" DROP CONSTRAINT "Products_pkey",
DROP COLUMN "id",
ADD COLUMN     "productId" SERIAL NOT NULL,
ADD CONSTRAINT "Products_pkey" PRIMARY KEY ("productId");

-- AlterTable
ALTER TABLE "public"."Shops" DROP CONSTRAINT "Shops_pkey",
DROP COLUMN "id",
ADD COLUMN     "shopId" SERIAL NOT NULL,
ADD CONSTRAINT "Shops_pkey" PRIMARY KEY ("shopId");

-- AlterTable
ALTER TABLE "public"."Tokens" DROP CONSTRAINT "Tokens_pkey",
DROP COLUMN "id",
ADD COLUMN     "tokenId" SERIAL NOT NULL,
ADD CONSTRAINT "Tokens_pkey" PRIMARY KEY ("tokenId");

-- AlterTable
ALTER TABLE "public"."Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "public"."Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Categories"("categoryId") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Categories" ADD CONSTRAINT "fk_category_deletedBy" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Conversations" ADD CONSTRAINT "Conversations_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "public"."Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Conversations" ADD CONSTRAINT "Conversations_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "public"."Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversations"("conversationId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."OrderItems" ADD CONSTRAINT "fk_order_item_order" FOREIGN KEY ("orderId") REFERENCES "public"."Orders"("orderId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."OrderItems" ADD CONSTRAINT "fk_order_item_product" FOREIGN KEY ("productId") REFERENCES "public"."Products"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "fk_order_shop" FOREIGN KEY ("shopId") REFERENCES "public"."Shops"("shopId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "fk_order_user" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "fk_payment_order" FOREIGN KEY ("orderId") REFERENCES "public"."Orders"("orderId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductCategories" ADD CONSTRAINT "ProductCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Categories"("categoryId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductCategories" ADD CONSTRAINT "ProductCategories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Products"("productId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductImages" ADD CONSTRAINT "fk_image_deletedBy" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductImages" ADD CONSTRAINT "fk_image_product" FOREIGN KEY ("productId") REFERENCES "public"."Products"("productId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "fk_product_deletedBy" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "fk_product_shop" FOREIGN KEY ("shopId") REFERENCES "public"."Shops"("shopId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Shops" ADD CONSTRAINT "fk_shop_user" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Tokens" ADD CONSTRAINT "fk_token_user" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;
