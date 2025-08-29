import SvgIcon from "../MiniComponents/SvgIcon.tsx";
import s from "./UserMenuItemWithCount.module.scss";

type Props = {
  props: {
    iconName: string,
    countLength: number,
    title: string
  }
}

const UserMenuItemWithCount = ({ props: { iconName, countLength, title } }: Props) => {
  const countNoun = countLength > 99 ? "99+" : countLength;

  return (
    <div className={s.link} aria-label={title}>
      <div className={s.wrapper}>
        <SvgIcon name={iconName} />
        {countLength > 0 && <span className={s.count}>{countNoun}</span>}
      </div>

      <span className={s.title}>{title}</span>
    </div>
  );
};
export default UserMenuItemWithCount;
