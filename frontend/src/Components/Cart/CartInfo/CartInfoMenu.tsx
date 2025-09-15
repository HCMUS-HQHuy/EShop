import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import { getSubTotal, formatePrice } from "src/Functions/formatting.ts";
import s from "./CartInfoMenu.module.scss";
import type { AppDispatch, RootState } from "src/Types/store.ts";
import type { ProductType } from "src/Types/product.ts";
import type { TFunction } from "i18next";
import { ALERT_STATE } from "src/Types/common.ts";

const CartInfoMenu = () => {
  const { cartProducts } = useSelector((state: RootState) => state.products);
  const subTotal = formatePrice(getSubTotal(cartProducts));
  const { t } = useTranslation();
  const cartInfo = "cartPage.cartInfoMenu";
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className={s.menu} role="region" aria-labelledby="cart-summary">
      <b>{t(`${cartInfo}.cartTotal`)}</b>

      <div className={s.content}>
        <div className={s.item}>
          <span>{t(`${cartInfo}.subTotal`)}:</span>
          <span aria-label={`Subtotal ${subTotal}`}>{subTotal}</span>
        </div>

        <div className={s.item}>
          <span>{t(`${cartInfo}.shipping`)}:</span>
          <span aria-label={t(`${cartInfo}.free`)}>
            {t(`${cartInfo}.free`)}
          </span>
        </div>

        <div className={s.item}>
          <span>{t(`${cartInfo}.total`)}:</span>
          <span aria-label={`Total ${subTotal}`}>{subTotal}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleCheckoutBtn(cartProducts, navigateTo, dispatch, t)}
      >
        {t("buttons.processToCheckout")}
      </button>
    </div>
  );
};
export default CartInfoMenu;

function handleCheckoutBtn(cartProducts: ProductType[], navigateTo: any, dispatch: AppDispatch, t: TFunction) {
  const isThereAnyCartItem = cartProducts.length > 0;

  if (isThereAnyCartItem) navigateTo("/checkout");
  else showEmptyCartAlert(dispatch, t);
}

function showEmptyCartAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.cartEmpty");
  dispatch(showAlert({ alertText, alertState: ALERT_STATE.WARNING, alertType: "alert" }));
}
