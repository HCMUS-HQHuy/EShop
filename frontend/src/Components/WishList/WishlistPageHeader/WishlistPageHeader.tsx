import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateProductsState } from "src/ReduxSlice/productsSlice.tsx";
import { getUniqueArrayByObjectKey } from "src/Functions/helper.ts";
import s from "./WishlistPageHeader.module.scss";
import type { RootState } from "src/Types/store.ts";

const WishlistPageHeader = () => {
  const { wishList, cartProducts } = useSelector((state: RootState) => state.products);
  const numberOfWishlist = wishList.length;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function moveAllToCart() {
    const uniqueCartProducts = getUniqueArrayByObjectKey({
      arr: cartProducts,
      newArr: wishList,
      key: "shortName",
    });

    dispatch(
      updateProductsState({ key: "cartProducts", value: uniqueCartProducts })
    );

    dispatch(updateProductsState({ key: "wishList", value: [] }));
  }

  return (
    <header className={s.header}>
      <p>{t("wishlist", { numberOfWishlist })}</p>

      <button type="button" onClick={moveAllToCart}>
        {t("buttons.moveAllToBag")}
      </button>
    </header>
  );
};
export default WishlistPageHeader;
