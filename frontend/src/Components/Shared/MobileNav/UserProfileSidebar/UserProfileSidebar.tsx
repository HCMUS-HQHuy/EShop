import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userImg, userPicturePlaceholder } from "src/Assets/Images/Images.ts";
import s from "./UserProfileSidebar.module.scss";
import type { RootState } from "src/Types/store.ts";

const UserProfileSidebar = () => {
  const { isMobileMenuActive } = useSelector((state: RootState) => state.global);
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { username, isSignIn } = loginInfo;
  const { t } = useTranslation();

  return (
    <div className={s.userInfo}>
      <Link
        to="/profile"
        title={t("mobileNav.profile")}
        className={s.img}
        aria-hidden={!isMobileMenuActive}
        tabIndex={isMobileMenuActive ? 0 : -1}
      >
        <img
          src={isSignIn ? userImg : userPicturePlaceholder}
          alt="user's picture"
          loading="lazy"
          decoding="async"
        />
      </Link>

      <p>
        {t("mobileNav.hey")} 🖐️
        <Link
          to="/profile"
          title={t("mobileNav.profile")}
          className={s.userName}
          aria-hidden={!isMobileMenuActive}
          tabIndex={isMobileMenuActive ? 0 : -1}
        >
          {username}
        </Link>
      </p>
    </div>
  );
};
export default UserProfileSidebar;
