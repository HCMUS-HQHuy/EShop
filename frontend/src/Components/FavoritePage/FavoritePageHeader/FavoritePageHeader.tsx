import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateProductsState } from "src/Features/productsSlice.tsx";
import { getUniqueArrayByObjectKey } from "src/Functions/helper.ts";
import s from "./FavoritePageHeader.module.scss";
import type { RootState } from "src/Types/store.ts";

const FavoritePageHeader = () => {
  const { favoritesProducts, cartProducts } = useSelector(
    (state: RootState) => state.products
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const numberOfProducts = favoritesProducts.length;
  const labelTrans = t("favoritePage.title", { numberOfProducts });

  return (
    <header className={s.header}>
      <p>{labelTrans}</p>

      <button
        type="button"
        onClick={() => moveAllToCart(cartProducts, favoritesProducts, dispatch)}
      >
        {t("buttons.moveAllToBag")}
      </button>
    </header>
  );
};
export default FavoritePageHeader;

function moveAllToCart(cartProducts: any[], favoritesProducts: any[], dispatch: any) {
  const uniqueCartProducts = getUniqueArrayByObjectKey({
    arr: cartProducts,
    newArr: favoritesProducts,
    key: "shortName",
  });

  dispatch(updateProductsState({ key: "favoritesProducts", value: [] }));
  dispatch(
    updateProductsState({ key: "cartProducts", value: uniqueCartProducts })
  );
}
