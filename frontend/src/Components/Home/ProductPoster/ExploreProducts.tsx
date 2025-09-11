import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard.tsx";
import s from "./ExploreProducts.module.scss";
import { productCardCustomizations } from "src/Data/staticData.tsx";
import { useSelector } from "react-redux";
import type { ProductType } from "src/Types/product.ts";
import type { RootState } from "src/Types/store.ts";

type prop = {
  numOfProducts?: number;
  customization: typeof productCardCustomizations[keyof typeof productCardCustomizations];
};

const ExploreProducts = ({ numOfProducts = -1, customization } : prop) => {
  const productsData: ProductType[] = useSelector((state: RootState) => state.products.productsList);
  const filteredProducts = productsData.filter((_, i) => (i < numOfProducts));
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
