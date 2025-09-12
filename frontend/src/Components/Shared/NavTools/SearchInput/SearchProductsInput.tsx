import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { productsData } from "src/Data/productsData.tsx";
import { updateLoadingState } from "src/ReduxSlice/loadingSlice.tsx";
import { updateProductsState } from "src/ReduxSlice/productsSlice.tsx";
import { searchByObjectKey } from "src/Functions/search.ts";
import SvgIcon from "../../MiniComponents/SvgIcon.tsx";
import SearchInput from "./SearchInput.tsx";
import s from "./SearchProductsInput.module.scss";
import api from "src/Api/index.api.ts";

const SearchProductsInput = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const searchRef = useRef("");
  const location = useLocation();
  const pathName = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSearchProducts(e: React.FormEvent) {
    setSearchParams({ query: searchRef.current });
    e.preventDefault();
    const isEmptyQuery = searchRef.current?.trim()?.length === 0;
    if (isEmptyQuery) return;

    updateSearchProducts();
  }

  function updateSearchProducts() {
    dispatch(updateLoadingState({ key: "loadingSearchProducts", value: true }));

    const queryValue = searchRef.current || searchParams.get("query");
    const isEmptyQuery = queryValue?.trim()?.length === 0;

    if (isEmptyQuery) {
      dispatch(updateProductsState({ key: "searchProducts", value: [] }));
      return;
    }

    getProducts(queryValue)
      .then((productsFound) => dispatch(updateProductsState({ key: "searchProducts", value: productsFound })))
      .then(() => dispatch(updateLoadingState({ key: "loadingSearchProducts", value: false })));
    navigateTo("/search?query=" + queryValue);
  }

  useEffect(() => {
    const isSearchPage = pathName === "/search";
    if (isSearchPage) updateSearchProducts();

    return () => {
      dispatch(updateLoadingState({ key: "loadingSearchProducts", value: true }));
    };
  }, []);

  return (
    <form
      className={s.searchContainer}
      onSubmit={handleSearchProducts}
      onClick={focusInput}
      role="search"
    >
      <SearchInput searchRef={searchRef} />

      <button type="submit" aria-label={t("tooltips.searchButton")}>
        <SvgIcon name="search" />
      </button>
    </form>
  );
};

export default SearchProductsInput;

function focusInput(e: React.FormEvent) {
  const searchInput = e.currentTarget.querySelector("#search-input") as HTMLInputElement | null;
  if (searchInput) {
    searchInput.focus();
  }
}

async function getProducts(query: string | null) {
  console.log("Searching products with query:", query);
  if (!query) return [];
  try {
    const response = await api.user.fetchProducts({ limit: 10, search: query });
    return response.data.products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
  // let productsFound = searchByObjectKey({
  //   data: productsData,
  //   key: "shortName",
  //   query,
  // });

  // if (productsFound.length === 0) {
  //   productsFound = searchByObjectKey({
  //     data: productsData,
  //     key: "category",
  //     query,
  //   });
  // }
  return [];
}
