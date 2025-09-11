import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_ORDER_PRODUCTS } from "src/Data/constants.tsx";
import { showAlert, updateAlertState } from "src/ReduxSlice/alertsSlice.tsx";
import useUpdateEffect from "src/Hooks/Helper/useUpdateEffect.tsx";
import s from "./OrderPageButtons.module.scss";
import type { RootState } from "src/Types/store.ts";

const OrderPageButtons = () => {
  const { isAlertActive, confirmPurpose } = useSelector(
    (state: RootState) => state.alerts.confirm
  );
  const { orderProducts } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const alertMsgKey = useRef("");

  function handleReceiveAll() {
    alertMsgKey.current = "receivedAllOrder";
    showConfirmAlert(t(`toastAlert.${alertMsgKey.current}`));
  }

  function handleCancelAll() {
    alertMsgKey.current = "cancelAllOrder";
    showConfirmAlert(t(`toastAlert.${alertMsgKey.current}`));
  }

  function showConfirmAlert(alertText: string) {
    if (!orderProducts.length) return;

    dispatch(
      updateAlertState({
        type: "confirm",
        key: "confirmPurpose",
        value: CLEAR_ORDER_PRODUCTS,
      })
    );

    dispatch(
      showAlert({
        alertText,
        alertState: "warning",
        alertType: "confirm",
      })
    );
  }

  useEffect(() => {
    if (!isAlertActive) return;
    const isRemoveOrderProduct = confirmPurpose === CLEAR_ORDER_PRODUCTS;

    if (isRemoveOrderProduct)
      showConfirmAlert(t(`toastAlert.${alertMsgKey.current}`));
  }, [i18n.language]);

  return (
    <div className={s.buttons}>
      <button type="button" onClick={handleReceiveAll}>
        {t("buttons.confirmReceiveAll")}
      </button>

      <button type="button" onClick={handleCancelAll}>
        {t("buttons.cancelAll")}
      </button>
    </div>
  );
};
export default OrderPageButtons;
