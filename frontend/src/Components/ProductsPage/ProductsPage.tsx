import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import { productCardCustomizations } from "src/Data/staticData.tsx";
import ExploreProducts from "../Home/ProductPoster/ExploreProducts.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards.tsx";
import s from "./ProductsPage.module.scss";
import type { RootState } from "src/Types/store.ts";

const ProductsPage = () => {
  const { loadingProductsPage } = useSelector((state: RootState) => state.loading);
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Products</title>
        <link rel="preconnect" href="https://api.github.com/" />
        <meta
          name="description"
          content={`Explore the entire collection of products available on ${WEBSITE_NAME}. From fashion to electronics, browse our comprehensive catalog to find the perfect items for your needs.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.productsPage}>
          <PagesHistory history={["/", t("history.products")]} historyPaths={undefined} />

          <section className={s.products} id="products-section">
            {!loadingProductsPage && (
              <ExploreProducts
                customization={productCardCustomizations.allProducts}
              />
            )}

            {loadingProductsPage && (
              <div className={s.SkeletonCards}>
                <SkeletonCards numberOfCards={8} />
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};
export default ProductsPage;
