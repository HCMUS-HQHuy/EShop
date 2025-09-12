import { useRef } from "react";
import { productsData } from "src/Data/productsData.tsx";
import { shouldDisplaySliderButtons } from "src/Functions/conditions.ts";
import useSlider from "src/Hooks/App/useSlider.tsx";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow.tsx";
import ProductCard from "../../ProductsCards/ProductCard/ProductCard.tsx";
import s from "./ProductsSlider.module.scss";
import SliderButtons from "./SliderButtons/SliderButtons.tsx";
import type { ProductType } from "src/Types/product.ts";
import type { productCardCustomizations } from "src/Data/staticData.tsx";

type Props = {
  filteredProducts: ProductType[];
  customization: typeof productCardCustomizations[keyof typeof productCardCustomizations];
  loading: "lazy" | "eager";
}

const ProductsSlider = ({
  filteredProducts,
  customization,
  loading,
}: Props) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef as React.RefObject<HTMLDivElement>);
  const { windowWidth } = useGetResizeWindow();

  const shouldDisplayButtons = shouldDisplaySliderButtons(
    windowWidth,
    filteredProducts
  );

  return (
    <>
      {shouldDisplayButtons && (
        <SliderButtons
          handleNextBtn={handleNextBtn}
          handlePrevBtn={handlePrevBtn}
        />
      )}

      <div className={s.productsSlider} ref={sliderRef} dir="ltr">
        {filteredProducts.map((product: ProductType) => (
          <ProductCard
            product={product}
            key={product.productId}
            customization={customization}
            removeFrom={undefined}
            loading={loading}
          />
        ))}
      </div>
    </>
  );
};

export default ProductsSlider;
