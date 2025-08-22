
type Product = {
  id: number;
  shortName: string;
  name: string;
  category: string[];
  price: number;
  discount: number;
//   description: string;
//   addedDate: string;
  img: string;
//   otherImages: string[];
  colors: Color[];
  rate: number;
  votes: number;
//   quantity: number;
//   sold: number;
}

type Color = {
  name: string;
  color: string;
}

export type { Product, Color };