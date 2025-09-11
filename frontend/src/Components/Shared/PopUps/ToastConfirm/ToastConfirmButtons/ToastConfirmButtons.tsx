import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_ORDER_PRODUCTS, REMOVE_ORDER_PRODUCT } from "src/Data/constants.tsx";
import { updateAlertState } from "src/ReduxSlice/alertsSlice.tsx";
import { removeByKeyName, setEmptyArrays } from "src/ReduxSlice/productsSlice.tsx";
import s from "./ToastConfirmButtons.module.scss";
import type { AppDispatch, RootState } from "src/Types/store.ts";

const ToastConfirmButtons = () => {
  const { confirmPurpose } = useSelector((state: RootState) => state.alerts.confirm);
  const { removeOrderProduct } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function handleConfirm() {
    switch (confirmPurpose) {
      case REMOVE_ORDER_PRODUCT:
        removeFromOrder(dispatch, removeOrderProduct);
        break;
      case CLEAR_ORDER_PRODUCTS:
        removeAllOrder(dispatch);
        break;
    }

    closeConfirmToast();
  }

  function closeConfirmToast() {
    dispatch(
      updateAlertState({ key: "isAlertActive", value: false, type: "confirm" })
    );
  }

  return (
    <div className={s.buttons}>
      <button type="button" onClick={handleConfirm}>
        {t("common.confirm")}
      </button>
      <button type="button" onClick={closeConfirmToast}>
        {t("common.cancel")}
      </button>
    </div>
  );
};
export default ToastConfirmButtons;

function removeFromOrder(dispatch: AppDispatch, removeOrderProduct: string) {
  dispatch(
    removeByKeyName({
      dataKey: "orderProducts",
      itemKey: "shortName",
      keyValue: removeOrderProduct,
    })
  );
}

function removeAllOrder(dispatch: AppDispatch) {
  dispatch(setEmptyArrays({ keys: ["orderProducts"] }));
}
