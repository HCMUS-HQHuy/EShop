import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateProductsState } from "src/ReduxSlice/productsSlice.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";
import SkeletonProductDetails from "../../Shared/SkeletonLoaders/DetailsPage/SkeletonProductDetails.tsx";
import ProductPreview from "../ProductPreview/ProductPreview.tsx";
import ProductColorsSection from "./ProductColorsSection/ProductColorsSection.tsx";
import ProductDealingControls from "./ProductDealingControls/ProductDealingControls.tsx";
import s from "./ProductDetails.module.scss";
import ProductFeatures from "./ProductFeatures/ProductFeatures.tsx";
import ProductFirstInfos from "./ProductFirstInfos/ProductFirstInfos.tsx";
import ProductSizes from "./ProductSizes/ProductSizes.tsx";
import type { RootState } from "src/Types/store.ts";
import type { ProductDetailType } from "src/Types/product.ts";

type Props = {
  productData: ProductDetailType | undefined;
}

const ProductDetails = ({ productData }: Props) => {
  const { loadingProductDetails } = useSelector((state: RootState) => state.loading);
  const { previewImg, isZoomInPreviewActive } = useSelector(
    (state: RootState) => state.global
  );
  const dispatch = useDispatch();
  const zoomInImgRef = useRef<HTMLImageElement>(null);
  const isWebsiteOnline = useOnlineStatus();
  const activeClass = isZoomInPreviewActive ? s.active : "";

  function handleZoomInEffect(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const imgRect = (e.target as HTMLElement).getClientRects()[0];
    if (!zoomInImgRef.current || !imgRect) return;
    const xPosition = e.clientX - imgRect.left;
    const yPosition = e.clientY - imgRect.top;
    const positions = `-${xPosition * 2}px, -${yPosition * 2}px`;
    zoomInImgRef.current.style.transform = `translate(${positions})`;
  }

  useEffect(() => {
    dispatch(
      updateProductsState({ key: "selectedProduct", value: productData })
    );
  }, []);

  return (
    <>
      {!loadingProductDetails && isWebsiteOnline && productData && (
        <section className={s.detailsSection} id="details-section">
          <ProductPreview
            productData={productData}
            handleZoomInEffect={handleZoomInEffect}
          />

          <section className={s.details}>
            <div className={`${s.zoomInPreview} ${activeClass}`}>
              <img src={`${import.meta.env.VITE_PUBLIC_URL}/${previewImg!}`} alt="product preview" ref={zoomInImgRef} />
            </div>

            <ProductFirstInfos productData={productData} />

            <div className={s.horizontalLine} />

            {/* <ProductColorsSection productData={productData} /> */}
            {/* {productData?.sizes && <ProductSizes productData={productData} />} */}
            <ProductDealingControls productData={productData} />
            <ProductFeatures />
          </section>
        </section>
      )}

      {(loadingProductDetails || !isWebsiteOnline) && (
        <SkeletonProductDetails />
      )}
    </>
  );
};
export default ProductDetails;
