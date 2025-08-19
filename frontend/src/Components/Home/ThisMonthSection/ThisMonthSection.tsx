import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { productsData } from "Data/productsData.jsx";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider.jsx";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle.jsx";
import s from "./ThisMonthSection.module.scss";

const ThisMonthSection = () => {
  const { t } = useTranslation();
  const thisMonthSection = "sectionTitles.thisMonthSection";

  return (
    <section className={s.thisMonthSection}>
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${thisMonthSection}.title`)}
          sectionName={t(`${thisMonthSection}.bestSelling`)}
        />

        <Link to="/products" className={s.viewAllBtn}>
          {t("buttons.viewAll")}
        </Link>
      </div>
      
      <ProductsSlider filterFun={filterThisMonthProducts} 
        customization={{
          stopHover: false,
          showDiscount: true,
          showFavIcon: true,
          showDetailsIcon: true,
          showRemoveIcon: false,
          showNewText: false,
          showWishList: true,
          showColors: false,
        }}
        loading="lazy" />
    </section>
  );
};
export default ThisMonthSection;

function filterThisMonthProducts() {
  const filteredProducts = productsData.filter(
    (productData) => productData.sold > 1000
  );

  return filteredProducts;
}
