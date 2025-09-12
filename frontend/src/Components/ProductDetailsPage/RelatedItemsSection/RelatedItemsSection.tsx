import { useTranslation } from "react-i18next";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider.tsx";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle.tsx";
import s from "./RelatedItemsSection.module.scss";
import { productCardCustomizations } from "src/Data/staticData.tsx";
import { useEffect, useState } from "react";
import type { ProductType } from "src/Types/product.ts";
import api from "src/Api/index.api.ts";

type Props = {
  currentProductId: number | undefined;
}

const RelatedItemsSection = ({ currentProductId }: Props) => {
  const { t } = useTranslation();
  const [hasRelatedProducts, setHasRelatedProducts] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const customization = productCardCustomizations.categoryProducts;
  customization.showColors = false;
  useEffect(() => {
    console.log("Fetching related products for product ID:", currentProductId);
    if (!currentProductId) return;
    api.user.getRelatedProducts(currentProductId).then((response) => {
      const { products } = response.data;
      setHasRelatedProducts(products.length > 0);
      setProducts(products);
    }).catch((error) => {
      console.error("Error fetching related products:", error);
    });
  }, [currentProductId]);

  return (
    <section className={s.section}>
      <SectionTitle type={2} eventName={t("detailsPage.relatedItems")} />

      {!hasRelatedProducts && <p>No related items were found.</p>}

      <ProductsSlider filteredProducts={products} customization={customization} loading="lazy" />
    </section>
  );
};
export default RelatedItemsSection;
