import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { camelCase } from "src/Functions/formatting.ts";
import SvgIcon from "../../MiniComponents/SvgIcon.jsx";
import s from "./CategoryCard.module.scss";

import type { CategoryInfor } from "src/Types/category.ts";

const CategoryCard = ({ categoryData }: { categoryData: CategoryInfor }) => {
  const { iconName, title, categoryId } = categoryData;
  const { t } = useTranslation();
  const categoryTitleTrans = t(`categoriesData.${camelCase(title)}`);

  return (
    <Link
      to={`/category?title=${title}&id=${categoryId}`}
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
