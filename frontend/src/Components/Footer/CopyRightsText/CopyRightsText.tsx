import { useTranslation } from "react-i18next";
import s from "./CopyRightsText.module.scss";

const CopyRightsText = () => {
  const developerProfile = "https://www.linkedin.com/in/hqhuy/";
  const copyRightTrans = "footer.copyRightsText";
  const { t } = useTranslation();

  return (
    <p className={s.copyRights}>
      <span>{'Website designed'}</span>
      <span>{t(`${copyRightTrans}.codedBy`)}</span>
      <a href={developerProfile} target="_blank">
        Huỳnh Quốc Huy
      </a>
    </p>
  );
};
export default CopyRightsText;
