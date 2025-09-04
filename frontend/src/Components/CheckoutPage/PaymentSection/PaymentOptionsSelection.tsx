import { useState } from "react";
import { useTranslation } from "react-i18next";
import { paymentCards, MomoPayment } from "src/Data/staticData.tsx";
import PaymentCards from "./PaymentCards.tsx";
import s from "./PaymentOptionsSelection.module.scss";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "src/Types/store.ts";
import type { PaymentMethodInforType } from "src/Types/paymentMethodInfor.ts";
import { setPaymentType } from "src/Features/paymentSlice.tsx";

const PaymentOptionsSelection = () => {
  const { paymentType, paymentMethodList } = useSelector((state: RootState) => state.payment)
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  function handleSelection(value: string) {
    dispatch(setPaymentType(value));
  }
  console.log("payment method list", paymentMethodList, paymentType);

  return (
    <div className={s.paymentOptions}>
      { paymentMethodList.map((method: PaymentMethodInforType) => {
        return (
          <div key={`${method.code}-parent`} className={s.input}>
            <div className={s.wrapper}>
              <input
                type="radio"
                name="payment"
                value={method.code}
                id={`${method.code}-option`}
                checked={paymentType === method.code}
                onChange={() => handleSelection(method.code)}
              />
              <label id={`${method.code}-label`} htmlFor={`${method.code}-option`}>
                {t(method.code)}
              </label>
            </div>
            <PaymentCards paymentCards={[{
              img: method.img,
              alt: method.name,
              link: method.link,
              id: method.id
            }]} />
          </div>
        );
      })

      }
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

      {/* <div className={s.input}>
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
      </div> */}
    </div>
  );
};

export default PaymentOptionsSelection;
