import { useTranslation } from "react-i18next";
import { translateProduct } from "../../../Cart/CartProducts/CartProduct.tsx";
import RateStars from "../../../Shared/MidComponents/RateStars/RateStars.tsx";
import s from "./ProductFirstInfos.module.scss";
import type { ProductDetailType } from "src/Types/product.ts";

type Props = {
  productData: ProductDetailType;
}

const ProductFirstInfos = ({ productData }: Props) => {
  const { name, price, votes, rate } = productData;
  const { t } = useTranslation();

  // const translatedProductName = translateProduct({
  //   productName: shortName,
  //   translateMethod: t,
  //   translateKey: "name",
  //   uppercase: true,
  // });

  // const translatedDescription = translateProduct({
  //   productName: shortName,
  //   translateMethod: t,
  //   translateKey: "description",
  // });

  return (
    <section className={s.firstInfos}>
      <h2 className={s.productName}>{name}</h2>

      <div className={s.rateAndReviews}>
        <RateStars rate={rate} />
        <span className={s.reviews}>{t("detailsPage.reviews", { votes })}</span>

        <div className={s.verticalLine} />

        <span className={s.greenText}>{t("detailsPage.inStock")}</span>
      </div>

      <span className={s.price} aria-label={`Price: ${price}`}>
        {price}
      </span>

      <p className={s.description}>{productData.description}</p>
    </section>
  );
};
export default ProductFirstInfos;
