import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_ORDER_PRODUCT } from "src/Data/constants.tsx";
import { SCREEN_SIZES } from "src/Data/globalVariables.tsx";
import { showAlert, updateAlertState } from "src/Features/alertsSlice.tsx";
import { updateProductsState } from "src/Features/productsSlice.tsx";
import { cartProductToolTipPos } from "src/Functions/tooltipPositions.ts";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow.tsx";
import SvgIcon from "../../Shared/MiniComponents/SvgIcon.tsx";
import ToolTip from "../../Shared/MiniComponents/ToolTip.tsx";
import s from "./RemoveOrderProductBtn.module.scss";
import type { AppDispatch, RootState } from "src/Types/store.ts";

type Props = {
  productName: string;
  translatedProduct: string;
}

const RemoveOrderProductBtn = ({ productName, translatedProduct }: Props) => {
  const { removeOrderProduct } = useSelector((state: RootState) => state.products);
  const { isAlertActive } = useSelector((state : RootState) => state.alerts).confirm;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { windowWidth } = useGetResizeWindow();
  const [toolTipLeftPos, setToolTipLeftPos] = useState(
    cartProductToolTipPos(i18n.language)
  );
  const [toolTipTopPos, setToolTipTopPos] = useState("50%");

  function updateToolTipPositions() {
    if (windowWidth <= SCREEN_SIZES.laptop) {
      setToolTipLeftPos("50%");
      setToolTipTopPos("-20px");
      return;
    }

    setToolTipLeftPos(cartProductToolTipPos(i18n.language));
    setToolTipTopPos("50%");
  }

  function showAlert() {
    showConfirmAlert(dispatch, productName, t, translatedProduct);
  }

  useEffect(() => {
    const isSelectedProduct = removeOrderProduct === productName;

    updateToolTipPositions();

    if (isAlertActive && isSelectedProduct) showAlert();
  }, [windowWidth, i18n.language]);

  return (
    <button
      type="button"
      className={s.removeButton}
      aria-label="Remove product from cart"
      onClick={showAlert}
    >
      <SvgIcon name="xMark" />
      <ToolTip
        top={toolTipTopPos}
        left={toolTipLeftPos}
        content={t("tooltips.remove")}
      />
    </button>
  );
};
export default RemoveOrderProductBtn;

function showConfirmAlert(dispatch: AppDispatch, productName: string, t: any, translatedProduct: string) {
  dispatch(
    showAlert({
      alertText: t("toastAlert.removeOrderProduct", {
        translatedProduct: translatedProduct,
      }),
      alertState: "warning",
      alertType: "confirm",
    })
  );

  dispatch(
    updateAlertState({
      type: "confirm",
      key: "confirmPurpose",
      value: REMOVE_ORDER_PRODUCT,
    })
  );

  dispatch(
    updateProductsState({ key: "removeOrderProduct", value: productName })
  );
}
