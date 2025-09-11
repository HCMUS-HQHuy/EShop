import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { removeById } from "src/ReduxSlice/productsSlice.tsx";
import { trashcanIconToolTipLeftPos } from "src/Functions/tooltipPositions.ts";
import SvgIcon from "../../../MiniComponents/SvgIcon.tsx";
import ToolTip from "../../../MiniComponents/ToolTip.tsx";
import s from "./ProductCardRemoveIcon.module.scss";

type prop = {
  removeFrom: string | undefined,
  productId: number
}

const ProductCardRemoveIcon = ({ removeFrom, productId }: prop) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const trashcanIconLeftToolTipPos = trashcanIconToolTipLeftPos(i18n.language);

  function removeProduct() {
    dispatch(removeById({ key: removeFrom, id: productId }));
  }

  return (
    <button
      type="button"
      className={`${s.iconHolder} ${s.removeIcon}`}
      aria-label={`Remove from ${removeFrom}`}
      onClick={removeProduct}
    >
      <SvgIcon name="trashCan" />
      <ToolTip
        top="18px"
        left={trashcanIconLeftToolTipPos}
        content={t("productCard.icons.remove")}
      />
    </button>
  );
};
export default ProductCardRemoveIcon;
