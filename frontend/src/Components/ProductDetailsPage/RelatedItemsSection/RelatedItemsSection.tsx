import { useTranslation } from "react-i18next";
import ProductsSlider from "../../Shared/MidComponents/ProductsSlider/ProductsSlider.tsx";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle.tsx";
import s from "./RelatedItemsSection.module.scss";

type Props = {
  productType: string;
  currentProduct: { [key: string]: any };
}

const RelatedItemsSection = ({ productType, currentProduct }: Props) => {
  const hasRelatedProducts = getProductsByRelatedType().length > 0;
  const { t } = useTranslation();

  function getProductsByRelatedType() {
    return productsData.filter((product) => {
      const isSameType = product.category === productType;
      const isCurrentProduct = product === currentProduct;
      return isSameType && !isCurrentProduct;
    });
  }

  return (
    <section className={s.section}>
      <SectionTitle type={2} eventName={t("detailsPage.relatedItems")} />

      {!hasRelatedProducts && <p>No related items were found.</p>}

      <ProductsSlider filterFun={getProductsByRelatedType} />
    </section>
  );
};
export default RelatedItemsSection;
