import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import s from "./Cart.module.scss";
import CartButtons from "./CartButtons/CartButtons.tsx";
import AddCoupon from "./CartInfo/AddCoupon.tsx";
import CartInfoMenu from "./CartInfo/CartInfoMenu.tsx";
import CartProducts from "./CartProducts/CartProducts.tsx";

const Cart = () => {
  const { t } = useTranslation();

  useScrollOnMount(110);

  return (
    <>
      <Helmet>
        <title>Cart</title>
        <meta
          name="description"
          content={`Review and manage your selected items in the ${WEBSITE_NAME} cart. Add products, apply coupons, and proceed to checkout for a seamless shopping experience.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.cartPage}>
          <PagesHistory history={["/", t("history.cart")]} historyPaths={undefined} />

          <div className={s.pageComponents} id="cart-page">
            <CartProducts />
            <CartButtons />

            <div className={s.wrapper}>
              <AddCoupon />
              <CartInfoMenu />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default Cart;
