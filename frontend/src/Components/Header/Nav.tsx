import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import s from "./Nav.module.scss";
import type { RootState } from "src/Types/store.ts";
import { USER_ROLE } from "src/Types/common.ts";

const Nav = () => {
  const { t, i18n } = useTranslation();
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { userRole } = useSelector((state: RootState) => state.global);
  const navDirection = i18n.dir() === "ltr" ? "ltr" : "rtl";

  if (userRole === USER_ROLE.SELLER) {
    return (
      <nav className={s.nav} dir={navDirection}>
        <ul>
          <li>
            <NavLink to="/seller">{t("nav.dashboard")}</NavLink>
          </li>

          <li>
            <NavLink to="/seller/products">{t("nav.products")}</NavLink>
          </li>

          <li>
            <NavLink to="/seller/orders">{t("nav.orders")}</NavLink>
          </li>

          <li>
            <NavLink to="/seller/chats">{t("nav.chat")}</NavLink>
          </li>
        </ul>
      </nav>
    )
  }

  // return (
  //   <nav className={s.nav} dir={navDirection}>
  //     <ul>

  //       <li>
  //         {loginInfo.isSignIn ? (
  //           <NavLink to="/profile">{t("nav.profile")}</NavLink>
  //         ) : (
  //           <NavLink to="/login">{t("nav.login")}</NavLink>
  //         )}
  //       </li>
  //     </ul>
  //   </nav>
  // );
};

export default Nav;
