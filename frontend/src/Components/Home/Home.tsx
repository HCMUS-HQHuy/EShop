import { Helmet } from "react-helmet-async";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import CategoriesSection from "./CategoriesSection/CategoriesSection.tsx";
import FeaturedSectionFeatures from "./FeaturedSection/FeaturedSectionFeatures.tsx";
import s from "./Home.module.scss";
import MainSlider from "./Introduction/MainSlider/MainSlider.tsx";
import OurProductsSection from "./OurProductsSection/OurProductsSection.tsx";

const Home = () => {
  useScrollOnMount();

  return (
    <>
      <Helmet>
        <title>EShop</title>
        <meta
          name="description"
          content="Your ultimate destination for effortless online shopping. Discover curated collections, easily add items to your cart and wishlist,and enjoy detailed product descriptions with captivating previews. Experience convenience like never before with our intuitive interface. Shop smarter with us today."
        />
      </Helmet>

      <main className={s.home}>
        <div className={s.container}>
          <div className={s.introductionContainer}>
            <MainSlider />
          </div>
          <CategoriesSection />
          <OurProductsSection />
          <FeaturedSectionFeatures />
        </div>
      </main>
    </>
  );
};

export default Home;
