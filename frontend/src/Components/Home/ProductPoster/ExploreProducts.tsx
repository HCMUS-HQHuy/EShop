import { productsData } from "src/Data/productsData.tsx";
import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard.tsx";
import s from "./ExploreProducts.module.scss";
import { productCardCustomizations } from "src/Data/staticData.tsx";

type prop = {
  numOfProducts?: number;
  customization: typeof productCardCustomizations.ourProducts;
};

const ExploreProducts = ({ numOfProducts = -1, customization } : prop) => {
  const filteredProducts = productsData.filter((_, i) => !(i < numOfProducts));

  return (
    <div className={s.products}>
      {filteredProducts.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          customization={customization}
          removeFrom={undefined}
        />
      ))}
    </div>
  );
};
export default ExploreProducts;
