import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { addToArray, storeToStorage } from "src/Features/productsSlice.tsx";
import { compareDataByObjValue } from "src/Functions/conditions.ts";
import s from "./BuyButton.module.scss";
import type { RootState } from "src/Types/store.ts";
import { STORAGE_KEYS } from "src/Types/common.ts";

const BuyButton = () => {
  const { selectedProduct, productQuantity, cartProducts, orderProducts } =
    useSelector((state: RootState) => state.products);
  const {
    loginInfo: { isSignIn },
  } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function handleBuyProduct() {
    const isAlreadyAddedToCart = compareDataByObjValue(
      cartProducts,
      selectedProduct,
      "shortName"
    );

    const isAlreadyAddedToOrder = compareDataByObjValue(
      orderProducts,
      selectedProduct,
      "shortName"
    );

    if (!isSignIn) {
      showWarning("pageRequiringSignIn");
      return;
    }

    if (isAlreadyAddedToCart) {
      showWarning("productAlreadyInCart");
      return;
    }

    if (isAlreadyAddedToOrder) {
      showWarning("productAlreadyInOrder");
      return;
    }

    addToCart();
  }

  function addToCart() {
    const clonedProduct = { ...selectedProduct };
    clonedProduct.quantity = productQuantity;

    dispatch(
      addToArray({
        key: "cartProducts",
        value: clonedProduct,
      })
    );
    dispatch(
      showAlert({
        alertText: t(`toastAlert.productAddedToCart`),
        alertState: "success",
        alertType: "alert",
      })
    );
    dispatch(storeToStorage({ key: STORAGE_KEYS.CART_PRODUCTS }));
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

  return (
    <button type="button" className={s.buyButton} onClick={handleBuyProduct}>
      {t("buttons.buyNow")}
    </button>
  );
};
export default BuyButton;
