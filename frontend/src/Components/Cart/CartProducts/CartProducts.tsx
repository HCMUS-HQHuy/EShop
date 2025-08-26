import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CartProduct from "./CartProduct.tsx";
import s from "./CartProducts.module.scss";
import type { RootState } from "src/Types/store.ts";

const CartProducts = () => {
  const { t } = useTranslation();
  const { cartProducts } = useSelector((state: RootState) => state.products);
  const productsTable = "cartPage.productsTable";

  return (
    <table className={s.cartProducts}>
      <thead>
        <tr>
          <th>{t(`${productsTable}.product`)}</th>
          <th>{t(`${productsTable}.price`)}</th>
          <th>{t(`${productsTable}.quantity`)}</th>
          <th>{t(`${productsTable}.subtotal`)}</th>
        </tr>
      </thead>

      <tbody>
        {cartProducts.map((product) => (
          <CartProduct key={product.id} data={product} />
        ))}
      </tbody>
    </table>
  );
};
export default CartProducts;
