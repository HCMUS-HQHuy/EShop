import ProductCardDetailsIcon from "./ProductCardDetailsIcon.tsx";
import ProductCardFavIcon from "./ProductCardFavIcon.tsx";
import s from "./ProductCardIcons.module.scss";
import ProductCardRemoveIcon from "./ProductCardRemoveIcon.tsx";
import ProductCardWishListIcon from "./ProductCardWishListIcon.tsx";

type prop = {
  iconsData: {
    showFavIcon: boolean;
    showDetailsIcon: boolean;
    showRemoveIcon: boolean;
    showWishList: boolean;
  },
  productId: number,
  navigateToProductDetails: () => void,
  product: any,
  removeFrom: string | undefined
}

const ProductCardIcons = ({
  iconsData: { showFavIcon, showDetailsIcon, showRemoveIcon, showWishList },
  productId,
  navigateToProductDetails,
  product,
  removeFrom,
}: prop) => {
  return (
    <div className={s.icons} data-product-icons-hover>
      {showFavIcon && (
        <ProductCardFavIcon product={product} productId={productId} />
      )}

      {showDetailsIcon && (
        <ProductCardDetailsIcon
          navigateToProductDetails={navigateToProductDetails}
        />
      )}

      {showRemoveIcon && (
        <ProductCardRemoveIcon productId={productId} removeFrom={removeFrom} />
      )}

      {showWishList && (
        <ProductCardWishListIcon product={product} productId={productId} />
      )}
    </div>
  );
};
export default ProductCardIcons;
