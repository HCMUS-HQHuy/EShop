import { useTranslation } from "react-i18next";
import SectionTitle from "src/Components/Shared/MiniComponents/SectionTitle/SectionTitle.jsx";
import s from "./FeaturedSection.module.scss";
import FeaturedSectionPosters from "./FeaturedSectionPosters.tsx";

const FeaturedSection = () => {
  const { t } = useTranslation();
  const featuredSection = "sectionTitles.featuredSection";

  return (
    <section className={s.featuredSection}>
      <SectionTitle
        eventName={t(`${featuredSection}.title`)}
        sectionName={t(`${featuredSection}.newArrival`)}
      />
      <FeaturedSectionPosters />
    </section>
  );
};
export default FeaturedSection;
