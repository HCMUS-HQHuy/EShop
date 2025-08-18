import { useRef } from "react";
import { useSelector } from "react-redux";
// import { categoriesData } from "Data/staticData.jsx";
import useSlider from "Hooks/App/useSlider.jsx";
import SliderButtons from "Components/Shared/MidComponents/ProductsSlider/SliderButtons/SliderButtons.jsx";
import CategoryCard from "Components/Shared/ProductsCards/CategoryCard/CategoryCard.tsx";
import s from "./CategoriesSlider.module.scss";
import type { RootState } from "Types/store.ts";

const CategoriesSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { categoryList } = useSelector((state: RootState) => state.categories);
  const { handleNextBtn, handlePrevBtn } = useSlider(sliderRef);

  return (
    <>
      <SliderButtons
        handlePrevBtn={handlePrevBtn}
        handleNextBtn={handleNextBtn}
      />

      <div className={s.categoriesSlider} ref={sliderRef}>
        {categoryList.map((categoryData) => (
          <CategoryCard categoryData={categoryData} key={categoryData.categoryId} />
        ))}
      </div>
    </>
  );
};
export default CategoriesSlider;
