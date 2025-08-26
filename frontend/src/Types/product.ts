import z from "zod";

const CreatingProductSchema = z.object({
  name: z.string().min(1).max(200),
  shortName: z.string().min(1).max(100),
  categories: z.array(z.string()).min(1),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).default(0),
  description: z.string().min(10).max(1000),
  mainImage: z.file(),
  additionalImages: z.array(z.file()).max(5),
  isActive: z.boolean().default(true),
});


const UpdatingProductSchema = CreatingProductSchema.extend({
  deletedImages: z.array(z.string()).optional(),
});

type CreatingProduct = z.infer<typeof CreatingProductSchema>;
type UpdatingProduct = z.infer<typeof UpdatingProductSchema>;

type Product = {
  id: number;
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

type Color = {
  name: string;
  color: string;
}

export type { Product, Color, CreatingProduct };
const ProductSchema = {
  CreatingRequest: CreatingProductSchema,
};
export default ProductSchema;