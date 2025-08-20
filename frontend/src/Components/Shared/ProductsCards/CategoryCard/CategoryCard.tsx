import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { camelCase } from "src/Functions/formatting.ts";
import SvgIcon from "../../MiniComponents/SvgIcon.jsx";
import s from "./CategoryCard.module.scss";

import type { CategoryInfor } from "src/Types/category.ts";

const CategoryCard = ({ categoryData }: { categoryData: CategoryInfor }) => {
  const { iconName, title } = categoryData;
  const categoryType = title.toLowerCase();
  const navigateTo = useNavigate();
  const { t } = useTranslation();
  const categoryTitleTrans = t(`categoriesData.${camelCase(title)}`);

  // function navigateToCategory() {
  //   navigateTo(`/category?type=${categoryType}`);
  // }

  return (
    <Link
      to={`/category?type=${categoryType}`}
      className={s.card}
      title={categoryTitleTrans}
      // onClick={navigateToCategory}
      ref={null}
    >
      <SvgIcon name={iconName} />
      <span>{categoryTitleTrans}</span>
    </Link>
  );
};
export default CategoryCard;
