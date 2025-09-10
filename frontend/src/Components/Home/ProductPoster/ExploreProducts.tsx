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
  // const filteredProducts = productsData.filter((_, i) => !(i < numOfProducts));
  const filteredProducts: ProductType[] = useSelector((state: RootState) => state.products.productsList);

  console.log("Filtered Products:", filteredProducts);
  customization.showColors = false;

  return (
    <div className={s.products}>
      {filteredProducts.map((product) => (
        <ProductCard
          product={product}
          key={product.productId}
          customization={customization}
          removeFrom={undefined}
        />
      ))}
    </div>
  );
};
export default ExploreProducts;
