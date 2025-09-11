import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import SkeletonCards from "../Shared/SkeletonLoaders/ProductCard/SkeletonCards.tsx";
import s from "./SearchPage.module.scss";
import SearchProducts from "./SearchProducts/SearchProducts.tsx";
import type { RootState } from "src/Types/store.ts";

const SearchPage = () => {
  const { t } = useTranslation();
  const { loadingSearchProducts } = useSelector((state: RootState) => state.loading);
  const { searchProducts } = useSelector((state: RootState) => state.products);
  const isWebsiteOnline = useOnlineStatus();

  return (
    <>
      <Helmet>
        <title>Search</title>
        <meta
          name="description"
          content={`Find what you\`re looking for quickly and easily on ${WEBSITE_NAME}\`s search page. Enter the product name or keywords to discover a wide range of options tailored to your preferences.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.searchPage}>
          <PagesHistory history={["/", t("history.results")]} historyPaths={undefined} />

          <section className={s.products} id="search-page">
            {(loadingSearchProducts || !isWebsiteOnline) && <SkeletonCards />}
            {!loadingSearchProducts && isWebsiteOnline && <SearchProducts />}
          </section>
        </main>
      </div>
    </>
  );
};
export default SearchPage;
