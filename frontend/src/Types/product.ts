import z from "zod";

const CreatingProductSchema = z.object({
  name: z.string().min(1).max(200),
  shortName: z.string().min(1).max(100),
  categories: z.array(z.coerce.number().min(0)).min(1),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).default(0),
  description: z.string().min(10).max(1000),
  mainImage: z.union([z.file(), z.string()]),
  additionalImages: z.array(z.union([z.file(), z.string()])).max(5),
  isActive: z.boolean().default(true),
});

const UpdatingProductSchema = CreatingProductSchema.extend({
  deletedImages: z.array(z.string()).max(5),
});

type CreatingProduct = z.infer<typeof CreatingProductSchema>;
type UpdatingProduct = z.infer<typeof UpdatingProductSchema>;

type ProductType = {
  id: number;
  shopId: number;
  shortName: string;
  name: string;
  category: string[];
  price: string;
  discount: string;
  afterDiscount: string;
//   description: string;
  addedDate: string;
  img: string;
//   otherImages: string[];
  colors: Color[];
  rate: number;
  votes: number;
  quantity: number;
}

type ProductOrderType = {
  id: number;
  shopId: number;
  shortName: string;
  name: string;
  category: string[];
  price: string;
  discount: string;
  afterDiscount: string;
//   description: string;
  addedDate: string;
  img: string;
//   otherImages: string[];
  colors: Color[];
  rate: number;
  votes: number;
  quantity: number;
  status: string;
}

type Color = {
  name: string;
  color: string;
}

type ProductDetailType = {
  shopId: number;
  name: string;
  shortName: string;
  description: string;
  price: string;
  discount: string;
  stockQuantity: number;
  sellerId: number;
  shopName: string;
  img: string;
  additionalImg: string;
  categoryIds: number[];
  additionalImages: string[];
  afterDiscount: string;
}

export type { ProductType, Color, CreatingProduct, ProductDetailType, ProductOrderType };
const ProductSchema = {
  CreatingRequest: CreatingProductSchema,
  EditingRequest: UpdatingProductSchema
};
export default ProductSchema;