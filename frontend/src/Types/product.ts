import z from "zod";

const CreatingProductSchema = z.object({
  name: z.string().min(1).max(200),
  shortName: z.string().min(1).max(100),
  categories: z.array(z.coerce.number().min(0)).min(1),
  price: z.coerce.number().min(0),
  stockQuantity: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).default(0),
  description: z.string().min(10).max(1000),
  imageUrl: z.union([z.file(), z.string()]),
  additionalImages: z.array(z.union([z.file(), z.string()])).max(5),
  isActive: z.boolean().default(true),
});

const UpdatingProductSchema = CreatingProductSchema.extend({
  deletedImages: z.array(z.string()).max(5),
});

type CreatingProduct = z.infer<typeof CreatingProductSchema>;

type ProductType = {
  productId: number;
  shop: { userId: number; shopId: number; shopName: string; };
  name: string;
  shortName: string;
  price: string;
  discount: string;
  stockQuantity: number;
  imageUrl: string;
  afterDiscount: string;
  createdAt: string;
  categoryIds: number[];
}

type OrderType = {
  orderId: number;
  shopId: number;
  total: number;
  shippingFee: number;
  discount: number;
  createdAt: string;
  final: number;
  status: string;
  email: string;
  receiverName: string;
  shippingAddress: string;
  phoneNumber: string;
  orderItems: OrderItemType[];
}

type OrderItemType = {
  product: {
    productId: number;
    name: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
  discount: number;
}

type ProductDetailType = ProductType & {
  description: string;
  shop: {
    shopId: number;
    shopName: string;
    userId: number;
  }
  additionalImg: string;
  additionalImages: string[];
}

export type { ProductType, CreatingProduct, ProductDetailType, OrderType, OrderItemType };
const ProductSchema = {
  CreatingRequest: CreatingProductSchema,
  EditingRequest: UpdatingProductSchema
};
export default ProductSchema;