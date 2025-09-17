import { useTranslation } from "react-i18next";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import s from "./OrderPage.module.scss";
import OrderHistory from "./CartProducts/OrderHistory.tsx";

const OrderPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <main className={s.orderPage}>
        <PagesHistory history={["/", t("history.orders")]} historyPaths={undefined} />

        <div className={s.pageComponents} id="order-page">
          <OrderHistory />
        </div>
      </main>
    </div>
  );
};
export default OrderPage;
