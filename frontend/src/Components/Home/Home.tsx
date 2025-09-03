import { Helmet } from "react-helmet-async";
import { productImg1 } from "src/Assets/Images/Images.ts";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import CategoriesSection from "./CategoriesSection/CategoriesSection.tsx";
import FeaturedSection from "./FeaturedSection/FeaturedSection.tsx";
import FeaturedSectionFeatures from "./FeaturedSection/FeaturedSectionFeatures.tsx";
import s from "./Home.module.scss";
import MainSlider from "./Introduction/MainSlider/MainSlider.tsx";
import SectionsMenu from "./Introduction/SectionsMenu/SectionsMenu.tsx";
import OurProductsSection from "./OurProductsSection/OurProductsSection.tsx";
import ProductPoster from "./ProductPoster/ProductPoster.tsx";
import ThisMonthSection from "./ThisMonthSection/ThisMonthSection.tsx";
import TodaySection from "./TodaySection/TodaySection.tsx";

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
        <link rel="preload" as="image" type="image/webp" href={productImg1} />
      </Helmet>

      <main className={s.home}>
        <div className={s.container}>
          <div className={s.introductionContainer}>
            {/* <SectionsMenu />

            <div className={s.line} /> */}

            <MainSlider />
          </div>

          {/* <TodaySection /> */}
          <CategoriesSection />
          {/* <ThisMonthSection /> */}
          {/* <ProductPoster /> */}
          <OurProductsSection />
          {/* <FeaturedSection /> */}
          <FeaturedSectionFeatures />
        </div>
      </main>
    </>
  );
};

export default Home;
