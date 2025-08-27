import { useTranslation } from "react-i18next";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import ForYouSection from "../Shared/Sections/ForYouSection/ForYouSection.tsx";
import OrderProducts from "./CartProducts/OrderProducts.tsx";
import s from "./OrderPage.module.scss";
import OrderPageButtons from "./OrderPageButtons/OrderPageButtons.tsx";

const OrderPage = () => {
  const { t } = useTranslation();

  useScrollOnMount(200);

  return (
    <div className="container">
      <main className={s.orderPage}>
        <PagesHistory history={["/", t("history.orders")]} historyPaths={undefined} />

        <div className={s.pageComponents} id="order-page">
          <OrderProducts />
          <OrderPageButtons />
          {/* <ForYouSection /> */}
        </div>
      </main>
    </div>
  );
};
export default OrderPage;
