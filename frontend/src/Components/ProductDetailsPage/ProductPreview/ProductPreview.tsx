import { useDispatch, useSelector } from "react-redux";
import { updateGlobalState } from "src/Features/globalSlice.tsx";
import PreviewImages from "./ProductImages/PreviewImages.tsx";
import s from "./ProductPreview.module.scss";
import type { ProductDetailType } from "src/Types/product.ts";
import type { RootState } from "src/Types/store.ts";

type Props = {
  productData: ProductDetailType,
  handleZoomInEffect: (event: React.MouseEvent<HTMLImageElement>) => void,
}

const ProductPreview = ({ productData, handleZoomInEffect }: Props) => {
  const { previewImg } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();
  const { name, additionalImages } = productData;
  const hasOtherImages = additionalImages?.length !== 0 && additionalImages;

  function setZoomInPreview(value = false) {
    dispatch(updateGlobalState({ key: "isZoomInPreviewActive", value: value }));
  }

  return (
    <section className={s.images}>
      {hasOtherImages && <PreviewImages productData={productData} />}

      <div className={s.previewImgHolder}>
        <img
          src={previewImg!}
          alt={name}
          onMouseMove={handleZoomInEffect}
          onMouseEnter={() => setZoomInPreview(true)}
          onMouseLeave={() => setZoomInPreview(false)}
        />
      </div>
    </section>
  );
};
export default ProductPreview;
