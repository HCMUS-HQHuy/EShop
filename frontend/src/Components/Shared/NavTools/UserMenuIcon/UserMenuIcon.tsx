import { useRef } from "react";
import { useTranslation } from "react-i18next";
import useEventListener from "src/Hooks/Helper/useEventListener.tsx";
import useToggle from "src/Hooks/Helper/useToggle.tsx";
import SvgIcon from "../../MiniComponents/SvgIcon.tsx";
import ToolTip from "../../MiniComponents/ToolTip.tsx";
import UserMenu from "../../UserMenu/UserMenu.tsx";
import s from "./UserMenuIcon.module.scss";

const UserMenuIcon = ({ visibility }: { visibility: boolean }) => {
  const { t } = useTranslation();
  const [isMenuUserActive, toggleMenuUserActive] = useToggle(false);
  const userContainerRef = useRef();
  const activeClass = isMenuUserActive ? s.active : "";

  useEventListener(document, "click", (event) => {
    const isUserIconClicked = userContainerRef?.current?.contains(event.target);
    if (isUserIconClicked) return;

    toggleMenuUserActive(false);
  });

  function openMenu() {
    toggleMenuUserActive(true);
  }

  if (!visibility) return null;

  return (
    <div
      className={`${s.userContainer} ${activeClass}`}
      onClick={toggleMenuUserActive}
      onFocus={openMenu}
      aria-label={t("navTools.userMenu")}
      aria-haspopup="true"
      ref={userContainerRef}
    >
      <SvgIcon name="user" />
      <ToolTip bottom="26px" left="50%" content={t("navTools.userMenu")} />

      <UserMenu isActive={isMenuUserActive} toggler={toggleMenuUserActive} />
    </div>
  );
};

export default UserMenuIcon;
