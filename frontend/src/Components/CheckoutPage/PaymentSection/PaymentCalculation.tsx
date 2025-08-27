import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatePrice, getSubTotal } from "src/Functions/formatting.ts";
import s from "./PaymentCalculation.module.scss";
import type { RootState } from "src/Types/store.ts";

const PaymentCalculation = () => {
  const { cartProducts } = useSelector((state: RootState) => state.products);
  const subTotal = formatePrice(getSubTotal(cartProducts));
  const { t } = useTranslation();
  const cartInfo = "cartPage.cartInfoMenu";

  return (
    <div className={s.calculationInfo}>
      <div className={s.item}>
        <span>{t(`${cartInfo}.subTotal`)}:</span>
        <span>{subTotal}</span>
      </div>

      <div className={s.item}>
        <span>{t(`${cartInfo}.shipping`)}:</span>
        <span>{t(`${cartInfo}.free`)}</span>
      </div>

      <div className={s.item}>
        <span>{t(`${cartInfo}.total`)}:</span>
        <span>{subTotal}</span>
      </div>
    </div>
  );
};
export default PaymentCalculation;
