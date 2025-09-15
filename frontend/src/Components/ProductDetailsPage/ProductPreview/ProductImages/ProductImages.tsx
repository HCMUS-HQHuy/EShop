import { useDispatch, useSelector } from "react-redux";
import { setPreviewImg } from "./PreviewImages.tsx";
import s from "./ProductImages.module.scss";
import type { ProductDetailType } from "src/Types/product.ts";
import type { RootState } from "src/Types/store.ts";

type Props = {
  img: string,
  productData: ProductDetailType,
  index: number
}

const ProductImages = ({ img, productData, index }: Props) => {
  const { previewImg } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();
  const activeClass = previewImg === img ? s.active : "";
  const { shortName, additionalImages } = productData;

  return (
    <button
      type="button"
      className={`${s.imgHolder} ${activeClass}`}
      onClick={() => setPreviewImg(additionalImages[index]!, dispatch)}
    >
      <img src={`${import.meta.env.VITE_PUBLIC_URL}/${img}`} alt={`${shortName} thumbnail image`} />
    </button>
  );
};
export default ProductImages;
