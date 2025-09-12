import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import s from "./PaymentProducts.module.scss";
import type { ProductType } from "src/Types/product.ts";

type Props = {
  products: ProductType[]
}

const PaymentProducts = ({ products }: Props) => {
  const hasProducts = products.length > 0;
  const { t } = useTranslation();

  return (
    <div className={s.products}>
      {products.map(({ imageUrl, name, shortName, afterDiscount, productId }) => (
        <Link to={`/details?product=${productId}`} key={productId} className={s.product}>
          <div className={s.wrapper}>
            <img src={`${import.meta.env.VITE_PUBLIC_URL}/${imageUrl}`} alt={shortName} />
            <span> {name} </span>
          </div>

          <span className={s.price}>{afterDiscount}</span>
        </Link>
      ))}

      {!hasProducts && (
        <p className={s.hasNoProducts}>{t("checkoutPage.hasNoProducts")}</p>
      )}
    </div>
  );
};
export default PaymentProducts;
