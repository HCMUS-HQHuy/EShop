import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { updateGlobalState } from "src/Features/globalSlice.tsx";
import s from "./PreviewImages.module.scss";
import ProductImages from "./ProductImages.tsx";
import type { AppDispatch } from "src/Types/store.ts";
import type { ProductDetailType } from "src/Types/product.ts";

type Props = {
  productData: ProductDetailType;
};

const PreviewImages = ({ productData }: Props) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setPreviewImg(productData.additionalImages[0]!, dispatch);
  }, [searchParams]);

  return (
    <div className={s.otherImages}>
      {productData.additionalImages.map((img, i) => (
        <ProductImages key={i} img={img} productData={productData} index={i} />
      ))}
    </div>
  );
};

export default PreviewImages;

export function setPreviewImg(img: string, dispatch: AppDispatch) {
  dispatch(updateGlobalState({ key: "previewImg", value: img }));
}
