import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProductCard from "../Shared/ProductsCards/ProductCard/ProductCard.tsx";
import s from "./ProductsCategory.module.scss";
import type { productCardCustomizations } from "src/Data/staticData.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "src/Types/store.ts";
import { useEffect, useState } from "react";
import type { ProductType } from "src/Types/product.ts";
import api from "src/Api/index.api.ts";

type Props = {
  categoryId: number;
  customization: typeof productCardCustomizations[keyof typeof productCardCustomizations];
}

const ProductsCategory = ({ categoryId, customization }: Props) => {
  const { t } = useTranslation();
  const [categoryProducts, setCategoryProducts] = useState<ProductType[]>([]);
  const hasProducts = categoryProducts.length > 0;
  const { loadingCategoryPage } = useSelector((state: RootState) => state.loading);

  useEffect(() => {
    if (!categoryId) return;
    if (loadingCategoryPage) return;
    api.user.getProductsByCategory(categoryId, 0, 8).then((response) => {
      const { products } = response.data;
      setCategoryProducts(products);
    }).catch((error) => {
      console.error("Error fetching products by category:", error);
    });
  }, [categoryId]);

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
          key={product.productId}
          customization={customization}
          removeFrom={undefined}
        />
      ))}
    </div>
  );
};
export default ProductsCategory;
