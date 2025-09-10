/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_methods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "fk_category_deleted_by";

-- DropForeignKey
ALTER TABLE "public"."conversations" DROP CONSTRAINT "conversations_participant1_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."conversations" DROP CONSTRAINT "conversations_participant2_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "fk_order_item_order";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "fk_order_item_product";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "fk_order_shop";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "fk_order_user";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "fk_payment_method";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "fk_payment_order";

-- DropForeignKey
ALTER TABLE "public"."product_categories" DROP CONSTRAINT "product_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_categories" DROP CONSTRAINT "product_categories_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_images" DROP CONSTRAINT "fk_image_deleted_by";

-- DropForeignKey
ALTER TABLE "public"."product_images" DROP CONSTRAINT "fk_image_product";

-- DropForeignKey
ALTER TABLE "public"."product_reviews" DROP CONSTRAINT "fk_review_deleted_by";

-- DropForeignKey
ALTER TABLE "public"."product_reviews" DROP CONSTRAINT "fk_review_product";

-- DropForeignKey
ALTER TABLE "public"."product_reviews" DROP CONSTRAINT "fk_review_user";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "fk_product_deleted_by";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "fk_product_shop";

-- DropForeignKey
ALTER TABLE "public"."shops" DROP CONSTRAINT "fk_shop_user";

-- DropForeignKey
ALTER TABLE "public"."tokens" DROP CONSTRAINT "fk_token_user";

-- DropTable
DROP TABLE "public"."categories";

-- DropTable
DROP TABLE "public"."conversations";

-- DropTable
DROP TABLE "public"."messages";

-- DropTable
DROP TABLE "public"."order_items";

-- DropTable
DROP TABLE "public"."orders";

-- DropTable
DROP TABLE "public"."payment_methods";

-- DropTable
DROP TABLE "public"."payments";

-- DropTable
DROP TABLE "public"."product_categories";

-- DropTable
DROP TABLE "public"."product_images";

-- DropTable
DROP TABLE "public"."product_reviews";

-- DropTable
DROP TABLE "public"."products";

-- DropTable
DROP TABLE "public"."shops";

-- DropTable
DROP TABLE "public"."tokens";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."SORT_ATTRIBUTES";

-- DropEnum
DROP TYPE "public"."SORT_ORDERS";

-- CreateTable
CREATE TABLE "public"."Categories" (
    "categoryId" SERIAL NOT NULL,
    "iconname" VARCHAR(100),
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "parentId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(6),
    "deletedBy" INTEGER,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "public"."Conversations" (
    "id" SERIAL NOT NULL,
    "participant1Id" INTEGER NOT NULL,
    "participant2Id" INTEGER NOT NULL,
    "participant1Role" CHAR(10) NOT NULL,
    "participant2Role" CHAR(10) NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Messages" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN DEFAULT false,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItems" (
    "orderItemId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("orderItemId")
);

-- CreateTable
CREATE TABLE "public"."Orders" (
    "orderId" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "receiverName" VARCHAR(100) NOT NULL,
    "shippingAddress" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "shippingFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "final" DECIMAL(12,2) NOT NULL,
    "status" "public"."ORDER_STATUS" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "public"."PaymentMethods" (
    "paymentMethodId" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "img" VARCHAR(255),
    "link" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("paymentMethodId")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "paymentId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "paymentCode" VARCHAR(20) NOT NULL,
    "paymentMethodCode" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "public"."ORDER_STATUS" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "public"."ProductCategories" (
    "productId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "ProductCategories_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."ProductImages" (
    "imageId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(6),
    "deletedBy" INTEGER,

    CONSTRAINT "ProductImages_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "public"."Products" (
    "productId" SERIAL NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "shortName" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "stockQuantity" INTEGER NOT NULL,
    "imageUrl" VARCHAR(255),
    "shopId" INTEGER NOT NULL,
    "status" "public"."PRODUCT_STATUS" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(6),
    "deletedBy" INTEGER,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "public"."Shops" (
    "shopId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "shopName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "shopDescription" TEXT,
    "address" VARCHAR(255) NOT NULL,
    "status" "public"."SHOP_STATUS" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "adminNote" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shops_pkey" PRIMARY KEY ("shopId")
);

-- CreateTable
CREATE TABLE "public"."Tokens" (
    "tokenId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("tokenId")
);

-- CreateTable
CREATE TABLE "public"."Users" (
    "userId" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255),
    "phoneNumber" VARCHAR(15),
    "role" "public"."USER_ROLE" NOT NULL DEFAULT 'CUSTOMER',
    "status" "public"."USER_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_title_key" ON "public"."Categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethods_code_key" ON "public"."PaymentMethods"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_paymentCode_key" ON "public"."Payments"("paymentCode");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_sku_shop" ON "public"."Products"("sku", "shopId");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_userId_key" ON "public"."Shops"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_email_key" ON "public"."Shops"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "public"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- AddForeignKey
ALTER TABLE "public"."Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Categories"("categoryId") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Categories" ADD CONSTRAINT "fk_category_deletedBy" FOREIGN KEY ("deletedBy") REFERENCES "public"."Users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Conversations" ADD CONSTRAINT "Conversations_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "public"."Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Conversations" ADD CONSTRAINT "Conversations_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "public"."Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

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
ALTER TABLE "public"."Payments" ADD CONSTRAINT "fk_payment_method" FOREIGN KEY ("paymentMethodCode") REFERENCES "public"."PaymentMethods"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
