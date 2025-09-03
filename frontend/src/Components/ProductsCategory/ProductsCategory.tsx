import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { productsData } from "src/Data/productsData.tsx";
import ProductCard from "../Shared/ProductsCards/ProductCard/ProductCard.tsx";
import s from "./ProductsCategory.module.scss";
import type { productCardCustomizations } from "src/Data/staticData.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "src/Types/store.ts";

type Props = {
  categoryName: string;
  customization: typeof productCardCustomizations[keyof typeof productCardCustomizations];
}

const ProductsCategory = ({ categoryName, customization }: Props) => {
  const { t } = useTranslation();
  const categoryProducts = useSelector((state: RootState)=>state.products.productsList)
                          .filter((product) => product.categoryIds.some(id => categoryIds.includes(id)));
  // console.log(categoryIds, categoryProducts);
  // const categoryProducts = productsData.filter(
  //   (product) => product.category === categoryName
  // );

  const hasProducts = categoryProducts.length > 0;

  if (!hasProducts)
    return (
      <div className={s.notFoundMessage}>
        <p>{t("common.weDontHaveProducts")}</p>
        <p>
          {t("common.backTo")} <Link to="/">{t("common.home")}</Link>
        </p>
      </div>
    );

  return (
    <div className={s.products}>
      {categoryProducts?.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          customization={customization}
        />
      ))}
    </div>
  );
};
export default ProductsCategory;
