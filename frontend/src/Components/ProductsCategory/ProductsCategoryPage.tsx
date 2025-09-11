import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import { productCardCustomizations } from "src/Data/staticData.tsx";
import useGetSearchParam from "src/Hooks/Helper/useGetSearchParam.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";
import CategoriesSection from "../Home/CategoriesSection/CategoriesSection.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards.tsx";
import ProductsCategory from "./ProductsCategory.tsx";
import s from "./ProductsCategoryPage.module.scss";
import type { RootState } from "src/Types/store.ts";

const ProductsCategoryPage = () => {
  const { loadingCategoryPage } = useSelector((state: RootState) => state.loading);
  const { t } = useTranslation();
  const categoryType = useGetSearchParam("type");
  const categoryTypeTrans = t(`categoriesData.${categoryType}`);
  const isWebsiteOnline = useOnlineStatus();

  return (
    <>
      <Helmet>
        <title>{categoryType}</title>
        <meta
          name="description"
          content={`Discover a wide range of products categorized for easy browsing on ${WEBSITE_NAME}. Explore our extensive selection by category or type to find exactly what you're looking for.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.categoryPage}>
          <PagesHistory history={["/", categoryTypeTrans]} historyPaths={undefined} />

          <section className={s.categoryContent} id="category-page">
            {!loadingCategoryPage && isWebsiteOnline && (
              <ProductsCategory
                categoryName={categoryType}
                customization={productCardCustomizations.categoryProducts}
              />
            )}

            {(loadingCategoryPage || !isWebsiteOnline) && (
              <div className={s.skeletonCards}>
                <SkeletonCards numberOfCards={4} />
              </div>
            )}
          </section>

          <CategoriesSection />
        </main>
      </div>
    </>
  );
};
export default ProductsCategoryPage;
