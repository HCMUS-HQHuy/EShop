import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useGetSearchParam from "src/Hooks/Helper/useGetSearchParam.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import ProductDetails from "./ProductDetails/ProductDetails.tsx";
import s from "./ProductDetailsPage.module.scss";
import api from "src/Api/index.api.ts";
import { useEffect, useState } from "react";
import type { ProductDetailType } from "src/Types/product.ts";
import { setAfterDiscountKey, setFormattedPrice } from "src/Functions/formatting.ts";

const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const PRODUCT_ID = Number(useGetSearchParam("product"));
  const [PRODUCT_DATA, setProductData] = useState<ProductDetailType | undefined>(undefined);
  useEffect(() => {
    if (PRODUCT_DATA != undefined) return;
    api.product.getById(PRODUCT_ID).then((response) => {
      const { product } = response.data;
      console.log(product);
      if (product) {
        const productDetails = product as ProductDetailType;
        setAfterDiscountKey(productDetails);
        setFormattedPrice(productDetails);
        setProductData(productDetails);
      }
    }).catch((error) => {
      console.error("Error fetching product details:", error);
    });
  }, [PRODUCT_DATA]);

  const productName = PRODUCT_DATA?.shortName.replaceAll(" ", "");
  const history = [
    t("history.products"),
    productName,
  ];
  const historyPaths = [
    {
      index: 0,
      path: "/products",
    },
    {
      index: 1,
      path: `/category?type=${PRODUCT_DATA?.categoryIds[0]}`,
    },
  ];
  if (!PRODUCT_DATA) {
    return <></>;
  }

  return (
    <>
      <Helmet>
        <title>{PRODUCT_DATA.shortName}</title>
        <meta
          name="description"
          content={`Explore the details and specifications of your favorite products on ${WEBSITE_NAME}. Find everything you need to know, from features to customer reviews, before making your purchase.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.detailsPage}>
          <PagesHistory history={history} historyPaths={historyPaths} />
          <ProductDetails productData={PRODUCT_DATA} />
          {/* <RelatedItemsSection
            productType={PRODUCT_DATA.categoryIds[0]}
            currentProduct={PRODUCT_DATA}
          /> */}
        </main>
      </div>
    </>
  );
};
export default ProductDetailsPage;
