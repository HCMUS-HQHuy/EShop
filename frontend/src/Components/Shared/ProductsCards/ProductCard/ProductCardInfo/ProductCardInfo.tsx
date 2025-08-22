import { useTranslation } from "react-i18next";
import { translateProduct } from "src/Components/Cart/CartProducts/CartProduct.tsx";
import RateStars from "src/Components/Shared/MidComponents/RateStars/RateStars.tsx";
import ProductColors from "src/Components/Shared/MiniComponents/ProductColors/ProductColors.tsx";
import s from "./ProductCardInfo.module.scss";
import type { Product } from "src/Types/product.ts";

type Props = {
  product: Product;
  showColors: boolean;
  navigateToProductDetails: () => void;
}

const ProductCardInfo = ({ product, showColors, navigateToProductDetails }: Props) => {
  const { shortName, price, discount, afterDiscount, rate, votes, colors } =
    product;
  // const { t } = useTranslation();

  // const translatedProductName = translateProduct({
  //   productName: shortName,
  //   translateMethod: t,
  //   translateKey: "shortName",
  // });

  return (
    <section className={s.productInfo}>
      <strong className={s.productName}>
        <a href="#" onClick={() => navigateToProductDetails()}>
          {shortName}
        </a>
      </strong>

      <div className={s.price}>
        {afterDiscount}
        {Number(discount) > 0 && <del className={s.afterDiscount}>{price}</del>}
      </div>

      <div className={s.rateContainer}>
        <RateStars rate={rate} />
        <span className={s.numOfVotes}>({votes})</span>
      </div>

      {showColors && (
        <div className={s.colors}>
          <ProductColors colors={colors} />
        </div>
      )}
    </section>
  );
};
export default ProductCardInfo;
