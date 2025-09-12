import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard.tsx";
import s from "./ExploreProducts.module.scss";
import { productCardCustomizations } from "src/Data/staticData.tsx";
import type { ProductType } from "src/Types/product.ts";

type Props = {
  filteredProducts: ProductType[];
  customization: typeof productCardCustomizations[keyof typeof productCardCustomizations];
};

const ExploreProducts = ({ filteredProducts, customization } : Props) => {
  customization.showColors = false;

  return (
    <div className={s.products}>
      {filteredProducts.map((product) => (
        <ProductCard
          product={product}
          key={product.productId}
          customization={customization}
          removeFrom={undefined}
          loading="lazy"
        />
      ))}
    </div>
  );
};
export default ExploreProducts;
