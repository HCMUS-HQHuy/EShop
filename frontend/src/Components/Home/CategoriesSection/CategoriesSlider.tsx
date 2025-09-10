import { useRef } from "react";
import { useSelector } from "react-redux";
import { categoriesData } from "src/Data/staticData.tsx";
import useSlider from "src/Hooks/App/useSlider.tsx";
import SliderButtons from "src/Components/Shared/MidComponents/ProductsSlider/SliderButtons/SliderButtons.tsx";
import CategoryCard from "src/Components/Shared/ProductsCards/CategoryCard/CategoryCard.tsx";
import s from "./CategoriesSlider.module.scss";
import type { RootState } from "src/Types/store.ts";

const CategoriesSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(undefined);
  const { categoryList } = useSelector((state: RootState) => state.categories);
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef as React.RefObject<HTMLDivElement>);

  return (
    <>
      <SliderButtons
        handlePrevBtn={handlePrevBtn}
        handleNextBtn={handleNextBtn}
      />

      <div className={s.categoriesSlider} ref={sliderRef as React.RefObject<HTMLDivElement>}>
        {categoryList.map((categoryData) => (
          <CategoryCard categoryData={categoryData} key={categoryData.categoryId} />
        ))}
      </div>
    </>
  );
};
export default CategoriesSlider;
