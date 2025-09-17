import { useTranslation } from "react-i18next";
import SectionTitle from "../../Shared/MiniComponents/SectionTitle/SectionTitle.jsx";
import s from "./CategoriesSection.module.scss";

import { useRef } from "react";
import { useSelector } from "react-redux";
import CategoryCard from "src/Components/Shared/ProductsCards/CategoryCard/CategoryCard.tsx";
import type { RootState } from "src/Types/store.ts";

const CategoriesSection = () => {
  const { t } = useTranslation();
  const sliderRef = useRef<HTMLDivElement>(undefined);
  const { categoryList } = useSelector((state: RootState) => state.categories);
  const categoriesSection = "sectionTitles.categoriesSection";

  return (
    <section className={s.categoriesSection}>
      <div className={s.wrapper}>
        <SectionTitle
          eventName={t(`${categoriesSection}.title`)}
          sectionName={t(`${categoriesSection}.browseByCategory`)}
          sliderRef={sliderRef as React.RefObject<HTMLDivElement>}
        />
      </div>

      <div className={s.categoriesSlider} ref={sliderRef as React.RefObject<HTMLDivElement>}>
        {categoryList.map((categoryData) => (
          <CategoryCard categoryData={categoryData} key={categoryData.categoryId} />
        ))}
      </div>
    </section>
  );
};
export default CategoriesSection;
