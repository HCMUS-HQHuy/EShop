import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { productsData } from "Data/productsData.jsx";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider.jsx";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle.jsx";
import EventCounter from "./EventCounter.jsx";
import s from "./TodaySection.module.scss";

const TodaySection = () => {
  const todaysSection = "sectionTitles.todaysSection";
  const { t } = useTranslation();

  return (
    <section className={s.todaysSection} id="todays-section">
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${todaysSection}.title`)}
          sectionName={t(`${todaysSection}.flashSales`)}
        />
        <EventCounter eventName="flash-sales" timeEvent="3 23 19 56" />
      </div>

      <ProductsSlider filterFun={filterFlashSalesProducts} 
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

      <Link to="/products" className={s.viewProductsBtn}>
        {t("buttons.viewAllProducts")}
      </Link>
    </section>
  );
};
export default TodaySection;

function filterFlashSalesProducts() {
  return productsData.filter((productData) => productData.sold > 100);
}
