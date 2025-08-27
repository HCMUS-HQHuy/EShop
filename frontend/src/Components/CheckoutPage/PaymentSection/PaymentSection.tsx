import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AddCoupon from "../../Cart/CartInfo/AddCoupon.tsx";
import PaymentCalculation from "./PaymentCalculation.tsx";
import PaymentOptionsSelection from "./PaymentOptionsSelection.tsx";
import PaymentProducts from "./PaymentProducts.tsx";
import s from "./PaymentSection.module.scss";
import type { RootState } from "src/Types/store.ts";

const PaymentSection = () => {
  const { cartProducts } = useSelector((state: RootState) => state.products);
  const { t } = useTranslation();
  return (
    <section className={s.paymentSection}>
      <PaymentProducts products={cartProducts} />
      <PaymentCalculation />
      <PaymentOptionsSelection />
      <AddCoupon />

      <button type="submit" className={s.submitPaymentButton}>
        {t("buttons.placeOrder")}
      </button>
    </section>
  );
};
export default PaymentSection;
