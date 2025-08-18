import { useTranslation } from "react-i18next";
import { featuresSectionData } from "Data/staticData.jsx";
import { camelCase } from "Functions/formatting.js";
import Feature from "Components/Shared/MiniComponents/Feature/Feature.jsx";
import s from "./FeaturedSectionFeatures.module.scss";

const FeaturedSectionFeatures = () => {
  const featureSection = "aboutPage.featuresSectionData";
  const { t } = useTranslation();

  return (
    <div className={s.features}>
      {featuresSectionData?.map(({ iconImg, iconAlt, id }) => {
        const featuresTransData = `${featureSection}.${camelCase(iconAlt)}`;

        return (
          <Feature
            iconImg={iconImg}
            iconAlt={t(`${featuresTransData}.iconAlt`)}
            title={t(`${featuresTransData}.title`)}
            description={t(`${featuresTransData}.description`)}
            key={id}
            loading="lazy"
          />
        );
      })}
    </div>
  );
};
export default FeaturedSectionFeatures;
