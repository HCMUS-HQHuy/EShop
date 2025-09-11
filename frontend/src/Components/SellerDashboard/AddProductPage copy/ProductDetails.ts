
export type ProductDetails ={
  name: string;
  sku: string;
  price: string;
  discount: string;
  stockQuantity: number;
  status: string;
  shortName: string;
  description: string;
  imageUrl: string;
  productCategories: ProductCategory[];
  productImages: ProductImage[];
  isActive: boolean;
  deletedImages: string[];
}

export type ProductImage = {
  imageUrl: string;
}

export type ProductCategory = {
  categoryId: number;
}