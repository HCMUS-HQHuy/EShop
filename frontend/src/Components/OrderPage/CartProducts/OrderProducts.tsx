import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import OrderProduct from "./OrderProduct.tsx";
import s from "./OrderProducts.module.scss";
import type { RootState } from "src/Types/store.ts";
import OrderHistory from "./OrderHistory.tsx";

const OrderProducts = () => {
  const { t } = useTranslation();
  const { orderProducts } = useSelector((state: RootState) => state.products);
  console.log("Order Products:", orderProducts);
  const productsTable = "cartPage.productsTable";

  return <OrderHistory />;

  return (
    <table className={s.orderProducts}>
      <thead>
        <tr>
          <th>{t(`${productsTable}.product`)}</th>
          <th>{t(`${productsTable}.price`)}</th>
          <th>{t(`${productsTable}.quantity`)}</th>
          <th>{t(`${productsTable}.subtotal`)}</th>
          <th>{t(`${productsTable}.status`)}</th>
        </tr>
      </thead>

      <tbody>
        {orderProducts?.map((product) => (
          <OrderProduct key={product.orderId} data={product} />
        ))}
      </tbody>
    </table>
  );
};
export default OrderProducts;
