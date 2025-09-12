import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ProductCard from "../../Shared/ProductsCards/ProductCard/ProductCard.tsx";
import s from "./SearchProducts.module.scss";
import type { RootState } from "src/Types/store.ts";
import { productCardCustomizations } from "src/Data/staticData.tsx";

const SearchProducts = () => {
  const { searchProducts } = useSelector((state: RootState) => state.products);
  const isFoundResults = searchProducts.length > 0;
  const { t } = useTranslation();

  const customization = productCardCustomizations.allProducts;
  customization.showColors = false;

  return (
    <>
      {isFoundResults &&
        searchProducts?.map((product) => (
          <ProductCard product={product} key={product.productId} removeFrom={undefined} customization={customization} />
        ))}

      {!isFoundResults && (
        <p className={s.message}>{t("common.resultsNotFound")}</p>
      )}
    </>
  );
};
export default SearchProducts;
