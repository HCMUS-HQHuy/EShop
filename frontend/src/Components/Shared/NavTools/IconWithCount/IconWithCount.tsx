import { Link } from "react-router-dom";
import SvgIcon from "../../MiniComponents/SvgIcon.tsx";
import ToolTip from "../../MiniComponents/ToolTip.tsx";
import s from "./IconWithCount.module.scss";

type Props = {
  props: {
    iconName: string;
    visibility: boolean;
    routePath: string;
    countLength: number;
    title: string;
  }
}

const IconWithCount = ({
  props: { iconName, visibility, routePath, countLength, title },
}: Props) => {
  const count = countLength > 99 ? "99+" : countLength;

  return (
    visibility && (
      <Link to={routePath} className={s.link} aria-label={title}>
        <div className={s.wrapper}>
          <SvgIcon name={iconName} />
          {countLength > 0 && <span className={s.count}>{count}</span>}
        </div>

        {title && <ToolTip bottom="20px" left="50%" content={title} />}
      </Link>
    )
  );
};
export default IconWithCount;
