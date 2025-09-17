import { Link } from "react-router-dom";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useNavToolsProps from "src/Hooks/App/useNavToolsProps.tsx";
import NavTools from "../Shared/MidComponents/NavTools/NavTools.tsx";
import s from "./Header.module.scss";
import MobileNavIcon from "./MobileNavIcon.jsx";
import Nav from "./Nav.jsx";
import type { RootState } from "src/Types/store.ts";
import { useSelector } from "react-redux";
import { USER_ROLE } from "src/Types/common.ts";
import BackToUser from "./BackToUser.tsx";
import SearchProductsInput from "../Shared/NavTools/SearchInput/SearchProductsInput.tsx";

const Header = () => {
  const navToolsProps = useNavToolsProps();
  const { userRole } = useSelector((state: RootState) => state.global);
  const { name } = useSelector((state: RootState) => state.seller.shopInfo);
  const headerName = userRole === USER_ROLE.SELLER ? name : WEBSITE_NAME;
  const headerNameLink = userRole === USER_ROLE.SELLER ? "/seller" : "/";

  return (
    <header className={s.header} dir="ltr">
      <div className={s.container}>
        <h1>
          <Link to={headerNameLink}>{headerName}</Link>
        </h1>
        <SearchProductsInput />
        <div className={s.headerContent}>
          <Nav />
          { userRole === USER_ROLE.CUSTOMER && <NavTools {...navToolsProps} /> }
          { userRole === USER_ROLE.SELLER && <BackToUser/>}
        </div>

        <MobileNavIcon />
      </div>
    </header>
  );
};

export default Header;
