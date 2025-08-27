import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import s from "./CartButtons.module.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "src/Types/store.ts";
import { storeToStorage } from "src/Features/productsSlice.tsx";
import { STORAGE_KEYS } from "src/Types/common.ts";

const CartButtons = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  function updateCart() {
    dispatch(storeToStorage({ key: STORAGE_KEYS.CART_PRODUCTS }));
  }

  return (
    <div className={s.buttons}>
      <Link to="/products">{t("buttons.returnToShop")}</Link>
      <button type="button" onClick={updateCart}>{t("buttons.updateCart")}</button>
    </div>
  );
};
export default CartButtons;
