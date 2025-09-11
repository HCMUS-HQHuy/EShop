import { useRef } from "react";
import { productsData } from "src/Data/productsData.tsx";
import { shouldDisplaySliderButtons } from "src/Functions/conditions.ts";
import useSlider from "src/Hooks/App/useSlider.tsx";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow.tsx";
import ProductCard from "../../ProductsCards/ProductCard/ProductCard.tsx";
import s from "./ProductsSlider.module.scss";
import SliderButtons from "./SliderButtons/SliderButtons.tsx";

const ProductsSlider = ({
  filterFun = () => productsData,
  customization,
  loading,
}) => {
  const filteredProducts = filterFun();
  const sliderRef = useRef();
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef);
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
        {filteredProducts.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            customization={customization}
            loading={loading}
          />
        ))}
      </div>
    </>
  );
};

export default ProductsSlider;
