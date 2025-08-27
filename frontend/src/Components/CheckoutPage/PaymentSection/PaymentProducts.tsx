import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { translateProduct } from "../../Cart/CartProducts/CartProduct.tsx";
import s from "./PaymentProducts.module.scss";
import type { Product } from "src/Types/product.ts";

type Props = {
  products: Product[]
}

const PaymentProducts = ({ products }: Props) => {
  const hasProducts = products.length > 0;
  const { t } = useTranslation();

  return (
    <div className={s.products}>
      {products.map(({ img, name, shortName, afterDiscount, id }) => (
        <Link to={`/details?product=${id}`} key={id} className={s.product}>
          <div className={s.wrapper}>
            <img src={img} alt={shortName} />

            <span>
              {/* {translateProduct({
                productName: shortName,
                translateMethod: t,
                translateKey: "shortName",
              })} */ name}
            </span>
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
