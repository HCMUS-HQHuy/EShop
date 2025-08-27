import { useState } from "react";
import { useTranslation } from "react-i18next";
import { paymentCards, MomoPayment } from "src/Data/staticData.tsx";
import PaymentCards from "./PaymentCards.tsx";
import s from "./PaymentOptionsSelection.module.scss";

const PaymentOptionsSelection = () => {
  const [paymentType, setPaymentType] = useState("momo");
  const { t } = useTranslation();

  return (
    <div className={s.paymentOptions}>

      <div className={s.input}>
        <div className={s.wrapper}>
          <input
            type="radio"
            name="payment"
            value="momo"
            id="momo-option"
            checked={paymentType === "momo"}
            onChange={(e) => setPaymentType(e.target.value)}
            aria-checked={paymentType === "momo"}
            aria-labelledby="momo-label"
          />
          <label id="momo-label" htmlFor="momo-option">
            {t("momo")}
          </label>
        </div>
        <PaymentCards paymentCards={MomoPayment} />
      </div>
{/* 
      <div className={s.input}>
        <div className={s.wrapper}>
          <input
            type="radio"
            name="payment"
            value="bank"
            id="bank-option"
            checked={paymentType === "bank"}
            onChange={(e) => setPaymentType(e.target.value)}
            aria-checked={paymentType === "bank"}
            aria-labelledby="bank-label"
          />
          <label id="bank-label" htmlFor="bank-option">
            {t("bank")}
          </label>
        </div>
        <PaymentCards paymentCards={paymentCards} />
      </div> */}

      <div className={s.input}>
        <div className={s.wrapper}>
          <input
            type="radio"
            name="payment"
            value="cash"
            id="cash-option"
            checked={paymentType === "cash"}
            onChange={(e) => setPaymentType(e.target.value)}
            aria-checked={paymentType === "cash"}
            aria-labelledby="cash-label"
          />
          <label id="cash-label" htmlFor="cash-option">
            {t("cashOnDelivery")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsSelection;
