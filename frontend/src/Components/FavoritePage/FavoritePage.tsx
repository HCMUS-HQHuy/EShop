import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import ForYouSection from "../Shared/Sections/ForYouSection/ForYouSection.tsx";
import s from "./FavoritePage.module.scss";
import FavoritePageHeader from "./FavoritePageHeader/FavoritePageHeader.tsx";
import FavoriteProducts from "./FavoriteProducts/FavoriteProducts.tsx";

const FavoritePage = () => {
  const { t } = useTranslation();

  useScrollOnMount(0);

  return (
    <>
      <Helmet>
        <title>Favorite</title>
        <meta
          name="description"
          content={`Save and manage your favorite products on ${WEBSITE_NAME}. Create a personalized wishlist to easily access and purchase your preferred items anytime.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.favoritePage} id="favorite-page">
          <section className={s.favoritePageContent}>
            <FavoritePageHeader />

            <FavoriteProducts />
          </section>

          <ForYouSection />
        </main>
      </div>
    </>
  );
};
export default FavoritePage;
