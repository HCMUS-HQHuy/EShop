import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { productCardCustomizations } from "src/Data/staticData.tsx";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle.tsx";
import ExploreProducts from "../ProductPoster/ExploreProducts.tsx";
import s from "./OurProductsSection.module.scss";
import type { ProductType } from "src/Types/product.ts";
import { useSelector } from "react-redux";
import type { RootState } from "src/Types/store.ts";

const OurProductsSection = () => {
  const { t } = useTranslation();
  const ourProducts = "sectionTitles.ourProducts";

  const productsData: ProductType[] = useSelector((state: RootState) => state.products.productsList);
  const filteredProducts = productsData.filter((_, i) => (i < 8));
  
  return (
    <section className={s.ourProductsSection}>
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${ourProducts}.title`)}
          sectionName={t(`${ourProducts}.exploreProducts`)}
        />
      </div>

      <ExploreProducts
        filteredProducts={filteredProducts}
        customization={productCardCustomizations.ourProducts}
      />

      <Link to="/products" className={s.viewProductsBtn}>
        {t("buttons.viewAllProducts")}
      </Link>
    </section>
  );
};
export default OurProductsSection;
