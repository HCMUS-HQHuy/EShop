import { useSelector } from "react-redux";
import { mobileNavData } from "src/Data/staticData.tsx";
import s from "./NavLinksSideBar.module.scss";
import RestNavLinks from "./RestNavLinks.tsx";
import SideBarLink from "./SideBarLink/SideBarLink.tsx";
import type { RootState } from "src/Types/store.ts";

const NavLinksSideBar = () => {
  const { loginInfo } = useSelector((state: RootState) => state.user);

  return (
    <nav className={s.navLinks}>
      <ul>
        {mobileNavData.map(({ name, link, icon, requiteSignIn }, index) => {
          const shouldShow = requiteSignIn ? loginInfo.isSignIn : true;
          const currentPage =
            window.location.pathname === link ? "page" : undefined;

          if (!shouldShow) return null;

          return (
            <SideBarLink
              key={"mobile-nav-link-" + index}
              {...{ name, link, icon, currentPage }}
            />
          );
        })}

        <RestNavLinks />
      </ul>
    </nav>
  );
};
export default NavLinksSideBar;
