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
import PaginatedList from "../Shared/PaginatedList/PaginatedList.tsx";
import { useEffect, useState } from "react";
import type { ProductType } from "src/Types/product.ts";
import api from "src/Api/index.api.ts";
import { updateLoadingState } from "src/ReduxSlice/loadingSlice.tsx";

const ProductsPage = () => {
  const { loadingProductsPage } = useSelector((state: RootState) => state.loading);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const PAGE_SIZE = 8;
  const NUMBER_OF_PRODUCTS = useSelector((state: RootState) => state.products.numberOfProducts);
  const products = useSelector((state: RootState) => state.products.productsList);
  useEffect(()=>{
    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    window.scrollTo({ top: 120, left: 0, behavior: "smooth" });
    if (products.length > indexOfLastItem)
      setSelectedProducts(products.slice(indexOfFirstItem, indexOfLastItem));
    else {
      try {
        dispatch(updateLoadingState({ key: "loadingProductsPage", value: true }));
        api.user.fetchProducts({ offset: indexOfFirstItem, limit: PAGE_SIZE }).then((res) => {
          dispatch(updateLoadingState({ key: "loadingProductsPage", value: false }));
          setSelectedProducts(res.data.products);
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [currentPage]);

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
                filteredProducts={selectedProducts}
                customization={productCardCustomizations.allProducts}
              />
            )}

            {loadingProductsPage && (
              <div className={s.SkeletonCards}>
                <SkeletonCards numberOfCards={8} />
              </div>
            )}
          <PaginatedList currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfItems={NUMBER_OF_PRODUCTS} itemsPerPage={PAGE_SIZE}  />
          </section>
        </main>
      </div>
    </>
  );
};
export default ProductsPage;
