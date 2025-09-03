import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkDateBeforeMonthToPresent } from "src/Functions/time.ts";
import AddToCartButton from "./AddToCartButton/AddToCartButton.tsx";
import s from "./ProductCard.module.scss";
import ProductCardIcons from "./ProductCardIcons/ProductCardIcons.tsx";
import ProductCardInfo from "./ProductCardInfo/ProductCardInfo.tsx";
import { productCardCustomizations } from "src/Data/staticData.tsx";
import type { RootState } from "src/Types/store.ts";
import type { ProductType } from "src/Types/product.ts";

type Props = {
  product: ProductType;
  customization: typeof productCardCustomizations[keyof typeof productCardCustomizations];
  removeFrom: any;
  loading?: "eager" | "lazy" | undefined;
};

const ProductCard = ({ product, customization, removeFrom, loading = "eager"}: Props) => {
  const { shortName, discount, img, id, addedDate } = product;
  const {
    stopHover,
    showDiscount,
    showNewText,
    showFavIcon,
    showDetailsIcon,
    showRemoveIcon,
    showWishList,
    showColors,
  } = customization;
  const noHoverClass = stopHover ? s.noHover : "";
  const hideDiscountClass = Number(discount) <= 0 || !showDiscount ? s.hide : "";
  const hideNewClass = shouldHideNewWord();
  const { loadingProductDetails } = useSelector((state: RootState) => state.loading);
  const navigateTo = useNavigate();
  const iconsData = {
    showFavIcon,
    showDetailsIcon,
    showRemoveIcon,
    showWishList,
  };

  function shouldHideNewWord() {
    return checkDateBeforeMonthToPresent(new Date(addedDate)) || !showNewText
      ? s.hide
      : "";
  }

  function navigateToProductDetails() {
    if (loadingProductDetails) return;
    navigateTo(`/details?product=${id}`);
  }

  return (
    <div className={`${s.card} ${noHoverClass}`}>
      <div className={s.productImg}>
        <div className={s.imgHolder}>
          <img
            src={`${img}`}
            alt={shortName}
            aria-label={shortName}
            loading={loading}
            onClick={navigateToProductDetails}
          />
        </div>

        <div className={s.layerContent}>
          {hideNewClass && (
            <div className={`${s.discount} ${hideDiscountClass}`}>
              -{discount}%
            </div>
          )}

          <div className={`${s.new} ${hideNewClass}`}>New</div>

          <ProductCardIcons
            iconsData={iconsData}
            productId={id}
            navigateToProductDetails={navigateToProductDetails}
            product={product}
            removeFrom={removeFrom}
          />
          <AddToCartButton product={product} />
        </div>
      </div>

      <ProductCardInfo
        product={product}
        showColors={showColors}
        navigateToProductDetails={navigateToProductDetails}
      />
    </div>
  );
};
export default ProductCard;
