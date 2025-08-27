import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { addToArray, removeByKeyName, storeToStorage } from "src/Features/productsSlice.tsx";
import { compareDataByObjValue } from "src/Functions/conditions.ts";
import { isItemFound } from "src/Functions/helper.ts";
import SvgIcon from "../../../MiniComponents/SvgIcon.tsx";
import s from "./AddToCartButton.module.scss";
import type { Product, ProductDetailType } from "src/Types/product.ts";
import type { RootState } from "src/Types/store.ts";
import { STORAGE_KEYS } from "src/Types/common.ts";

type Props = {
  product: Product
}

const AddToCartButton = ({ product }: Props) => {
  const { t } = useTranslation();
  const { cartProducts, orderProducts } = useSelector(
    (state: RootState) => state.products
  );
  const {
    loginInfo: { isSignIn },
  } = useSelector((state: RootState) => state.user);
  const isProductAlreadyExist = isItemFound(cartProducts, product, "shortName");
  const iconName = isProductAlreadyExist ? "trashCan" : "cart3";
  const [iconNameState, setIconName] = useState(iconName);
  const dispatch = useDispatch();
  const buttonText = t(
    `productCard.buttonText.${
      isProductAlreadyExist ? "removeFromCart" : "addToCart"
    }`
  );

  function handleCartButton() {
    if (!isSignIn) {
      showWarning("addToCart");
      return;
    }

    const isAlreadyAddedToOrder = compareDataByObjValue(
      orderProducts,
      product,
      "shortName"
    );

    if (isAlreadyAddedToOrder) {
      showWarning("productAlreadyInOrder");
      return;
    }

    isProductAlreadyExist ? removeFromCart() : addToCart();
  }

  function showWarning(translateKey: string) {
    dispatch(
      showAlert({
        alertText: t(`toastAlert.${translateKey}`),
        alertState: "warning",
        alertType: "alert",
      })
    );
  }

  function addToCart() {
    const addAction = addToArray({ key: "cartProducts", value: { ...product, quantity: 1 } });
    dispatch(addAction);
    dispatch(storeToStorage({ key: STORAGE_KEYS.CART_PRODUCTS }));
    setIconName("trashCan");
  }

  function removeFromCart() {
    const removeAction = removeByKeyName({
      dataKey: "cartProducts",
      itemKey: "shortName",
      keyValue: product.shortName,
    });

    dispatch(removeAction);
    dispatch(storeToStorage({ key: STORAGE_KEYS.CART_PRODUCTS }));
    setIconName("cart3");
  }

  return (
    <button
      type="button"
      className={`${s.addToCartBtn} ${s.addToCartButton}`}
      onClick={handleCartButton}
      aria-label={buttonText}
      data-add-to-cart-button
    >
      <SvgIcon name={iconNameState} />
      <span>{buttonText}</span>
    </button>
  );
};
export default AddToCartButton;
